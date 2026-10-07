"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { useWebAuth } from "@/app/context/WebAuthContext";
import {
  BillingFormData,
  CheckoutContextType,
} from "@/app/types/checkout";
import {
  fetchUserDetailsByPhoneOrEmail,
  saveUserApi,
  FetchedUserDetails,
  UserSavePayload,
  DEVOTEE_BILLING_STORAGE_KEY,
} from "@/app/services/userService";
import { extractUserDetails } from "@/utils";
import { User } from "@/types";

export { DEVOTEE_BILLING_STORAGE_KEY };
export const DEVOTEE_BILLING_SAVED_STATUS_KEY = "devotee_billing_saved_status";
export type { BillingFormData, CheckoutContextType };

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const initialEmptyForm: BillingFormData = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  notes: "",
};


export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { user, token } = useWebAuth();

  const [formData, setFormData] = useState<BillingFormData>(initialEmptyForm);
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const [isFormSaved, setIsFormSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);


  // Initial form loading from localStorage and auth profile (purely local & instant)
  useEffect(() => {
    let initialForm = { ...initialEmptyForm };

    try {
      const savedData = localStorage.getItem(DEVOTEE_BILLING_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        initialForm = { ...initialForm, ...parsed };
        if (parsed.phone) {
          setHasSavedData(true);
        }
      }
    } catch (err) {
      console.warn("Could not read stored billing details:", err);
    }

    if (user) {
      const u = extractUserDetails(user);
      (Object.keys(u) as (keyof BillingFormData)[]).forEach((key) => {
        if (!initialForm[key] && u[key]) initialForm[key] = u[key];
      });
      if (initialForm.phone) {
        setHasSavedData(true);
      }
    }

    setFormData(initialForm);
  }, [user]);

  // Field updater
  const updateFormField = useCallback((name: keyof BillingFormData | string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      try {
        localStorage.setItem(DEVOTEE_BILLING_STORAGE_KEY, JSON.stringify(updated));
      } catch { }
      return updated;
    });
    setIsFormSaved(false);
  }, []);



  // Validation: Check mandatory form fields (first name, address, city, state, pincode, mobile)
  const missingMandatoryFields = useMemo(() => {
    const missing: string[] = [];
    if (!formData.firstName.trim()) missing.push("First Name");
    if (!formData.address.trim()) missing.push("Delivery Address");
    if (!formData.city.trim()) missing.push("Town / City");
    if (!formData.state.trim()) missing.push("State");
    if (!formData.pincode.trim() || formData.pincode.trim().length !== 6) {
      missing.push("6-digit PIN Code");
    }
    if (!formData.phone.trim() || formData.phone.trim().length !== 10) {
      missing.push("10-digit Mobile Number");
    }
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        missing.push("Valid Email Address");
      }
    }
    return missing;
  }, [formData]);

  const missingDetails = missingMandatoryFields;


  // Save or update address & devotee details
  const handleSaveDetails = useCallback(
    async (tokenOverride?: string): Promise<User | null> => {


      setIsSaving(true);

      try {
        localStorage.setItem(DEVOTEE_BILLING_STORAGE_KEY, JSON.stringify(formData));
        setHasSavedData(true);
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      const loggedInUserId = user?.id || (user as any)?.user_id || null;

      const payload: UserSavePayload = {
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        additional_details: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          notes: formData.notes.trim() || undefined,
        }
      };

      try {
        const savedUser = await saveUserApi(payload, tokenOverride || token || null, loggedInUserId);
        if (typeof window !== "undefined") {
          localStorage.setItem("web_customer_user", JSON.stringify(savedUser));
        }
        setIsFormSaved(true);
        setSaveMessage({
          type: "success",
          text: "Address details saved successfully to your devotee profile! 🪔",
        });
        window.dispatchEvent(new CustomEvent("user_updated"));
        setTimeout(() => setSaveMessage(null), 4000);
        return savedUser;
      } catch (err: any) {
        console.warn("User Save API error:", err);
        setSaveMessage({
          type: "error",
          text: err?.message || "Could not save address to server. Please try again.",
        });
        setTimeout(() => setSaveMessage(null), 5000);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [formData, token, user, missingMandatoryFields]
  );

  // Clear saved details
  const handleClearSavedDetails = useCallback(() => {
    try {
      localStorage.removeItem("web_customer_user");
      localStorage.removeItem(DEVOTEE_BILLING_STORAGE_KEY);

      setHasSavedData(false);
      setIsFormSaved(false);
      setFormData(initialEmptyForm);
      setSaveMessage({
        type: "success",
        text: "Saved details cleared.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (e) {
      console.warn("Could not clear saved details:", e);
    }
  }, []);

  // Customer details getters
  const resolvedAddress = (formData.address || user?.address || "").trim();
  const resolvedEmail = (formData.email || user?.email || "").trim();
  const resolvedPhone = (formData.phone || user?.phone || "").trim();
  const devoteeName =
    `${formData.firstName} ${formData.lastName}`.trim() ||
    user?.name ||
    (user?.firstname ? `${user.firstname} ${user.lastname || ""}`.trim() : "") ||
    "Devotee";

  // Focus helpers
  const focusFirstMissingField = useCallback((inputName?: string | keyof BillingFormData) => {
    if (inputName) {
      const targetEl = document.querySelector(`[name="${String(inputName)}"]`) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null;
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        targetEl.focus();
        return;
      }
    }

    const fieldsOrder: { selector: string; invalid: boolean }[] = [
      { selector: '[name="firstName"]', invalid: !formData.firstName.trim() },
      { selector: '[name="address"]', invalid: !formData.address.trim() },
      { selector: '[name="city"]', invalid: !formData.city.trim() },
      { selector: '[name="state"]', invalid: !formData.state.trim() },
      {
        selector: '[name="pincode"]',
        invalid: !formData.pincode.trim() || formData.pincode.trim().length !== 6,
      },
      {
        selector: '[name="phone"]',
        invalid: !formData.phone.trim() || formData.phone.trim().length !== 10,
      },
      {
        selector: '[name="email"]',
        invalid: Boolean(
          formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ),
      },
    ];

    const firstInvalid = fieldsOrder.find((f) => f.invalid);
    if (firstInvalid) {
      const el = document.querySelector(firstInvalid.selector) as HTMLElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    }
  }, [formData]);

  const focusSaveButton = useCallback(() => {
    const saveBtn = document.getElementById("save-address-btn");
    if (saveBtn) {
      saveBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      saveBtn.focus();
    } else {
      const phoneEl = document.querySelector('input[name="phone"]') as HTMLInputElement | null;
      phoneEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      phoneEl?.focus();
    }
  }, []);

  const value = {
    formData,
    updateFormField,
    hasSavedData,
    isFormSaved,
    setIsFormSaved,
    isSaving,
    saveMessage,
    setSaveMessage,
    isLoadingUser,
    missingMandatoryFields,
    handleSaveDetails,
    handleClearSavedDetails,
    focusFirstMissingField,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextType {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
