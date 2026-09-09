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
  fetchUserDetailsByPhoneOrEmail,
  saveUserApi,
  FetchedUserDetails,
  UserSavePayload,
  DEVOTEE_BILLING_STORAGE_KEY,
} from "@/app/services/userService";

export { DEVOTEE_BILLING_STORAGE_KEY };
export const DEVOTEE_BILLING_SAVED_STATUS_KEY = "devotee_billing_saved_status";

export interface BillingFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  notes: string;
}

export interface CheckoutContextType {
  formData: BillingFormData;
  updateFormField: (name: keyof BillingFormData | string, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<BillingFormData>>;
  hasSavedData: boolean;
  isFormSaved: boolean;
  setIsFormSaved: (saved: boolean) => void;
  isSaving: boolean;
  saveMessage: { type: "success" | "error"; text: string } | null;
  setSaveMessage: (msg: { type: "success" | "error"; text: string } | null) => void;
  fetchedUser: FetchedUserDetails | null;
  isLoadingUser: boolean;
  isDataSame: boolean;
  isBillingFormValid: boolean;
  missingMandatoryFields: string[];
  missingDetails: string[];
  fetchDevoteeUser: (phoneOverride?: string, emailOverride?: string) => Promise<FetchedUserDetails | null>;
  handleSaveDetails: (tokenOverride?: string) => Promise<FetchedUserDetails | null>;
  handleClearSavedDetails: () => void;
  resolvedAddress: string;
  resolvedPhone: string;
  resolvedEmail: string;
  devoteeName: string;
  focusFirstMissingField: () => void;
  focusSaveButton: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const initialEmptyForm: BillingFormData = {
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

function extractUserDetails(u: any): BillingFormData {
  if (!u) return initialEmptyForm;
  let additional: any = u.additional_details;
  if (typeof additional === "string") {
    try {
      additional = JSON.parse(additional);
    } catch { }
  }
  const addObj = additional && typeof additional === "object" ? additional : {};

  return {
    firstName: (u.firstname || (u.name ? u.name.split(" ")[0] : "") || "").trim(),
    lastName: (u.lastname || (u.name ? u.name.split(" ").slice(1).join(" ") : "") || "").trim(),
    address: (u.address || addObj.address || "").trim(),
    city: (u.city || addObj.city || "").trim(),
    state: (u.state || addObj.state || "").trim(),
    pincode: (u.pincode || addObj.pincode || "").trim(),
    phone: (u.phone || "").trim(),
    email: (u.email || "").trim(),
    notes: (u.notes || addObj.notes || "").trim(),
  };
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { user, token } = useWebAuth();

  const [formData, setFormData] = useState<BillingFormData>(initialEmptyForm);
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const [isFormSaved, setIsFormSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fetchedUser, setFetchedUser] = useState<FetchedUserDetails | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const fetchedUserRef = useRef(fetchedUser);
  fetchedUserRef.current = fetchedUser;

  // Single centralized user fetcher with memory caching via fetchedUserRef
  const fetchDevoteeUser = useCallback(
    async (phoneOverride?: string, emailOverride?: string): Promise<FetchedUserDetails | null> => {
      const phone = (phoneOverride !== undefined ? phoneOverride : (formDataRef.current.phone || user?.phone || "")).trim();
      const email = (emailOverride !== undefined ? emailOverride : (formDataRef.current.email || user?.email || "")).trim();

      if (!phone && !email && !token) return null;

      const currentFetched = fetchedUserRef.current;
      if (
        currentFetched &&
        ((phone && currentFetched.phone === phone) || (email && currentFetched.email === email))
      ) {
        return currentFetched;
      }

      try {
        setIsLoadingUser(true);
        const fetched = await fetchUserDetailsByPhoneOrEmail({ phone, email }, token || null);
        if (fetched) {
          setFetchedUser(fetched);
          if (typeof window !== "undefined" && fetched.id) {
            localStorage.setItem("devotee_user_id", String(fetched.id));
            localStorage.setItem("devotee_user", JSON.stringify(fetched));
            window.dispatchEvent(new CustomEvent("devotee_user_updated", { detail: fetched.id }));
          }
          return fetched;
        }
        return null;
      } catch (err) {
        console.warn("Error fetching devotee user details:", err);
        throw err;
      } finally {
        setIsLoadingUser(false);
      }
    },
    [user, token]
  );

  // Initial form loading from localStorage and auth profile (API fetch ONLY if user logged in)
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      let initialForm = { ...initialEmptyForm };

      try {
        const savedData = localStorage.getItem(DEVOTEE_BILLING_STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          initialForm = { ...initialForm, ...parsed };
          if (parsed.address || parsed.phone || parsed.email) {
            if (isMounted) setHasSavedData(true);
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
        if (initialForm.phone || initialForm.email || initialForm.address) {
          if (isMounted) setHasSavedData(true);
        }
      }

      if (isMounted) setFormData(initialForm);

      // Only fetch from backend on initial render IF user is logged in
      if (user || token) {
        const phoneToFetch = (initialForm.phone || user?.phone || "").trim();
        const emailToFetch = (initialForm.email || user?.email || "").trim();

        try {
          const serverUser = await fetchDevoteeUser(phoneToFetch, emailToFetch);
          if (serverUser && isMounted) {
            const serverDetails = extractUserDetails(serverUser);
            setHasSavedData(true);
            setIsFormSaved(true);
            setFormData((prev) => {
              const merged = { ...prev };
              (Object.keys(serverDetails) as (keyof BillingFormData)[]).forEach((k) => {
                if (!merged[k] && serverDetails[k]) merged[k] = serverDetails[k];
              });
              return merged;
            });
          }
        } catch (err) {
          console.warn("Could not fetch user details on mount:", err);
        } finally {
          // Mount fetch complete
        }
      }
    };

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, [user, token, fetchDevoteeUser]);

  // Dirty checking: Compare formData against server/auth devotee profile
  const isDataSame = useMemo(() => {
    const target = fetchedUser || user;
    if (!target) return false;
    const u = extractUserDetails(target);
    const norm = (str?: string) => (str || "").trim().toLowerCase();

    return (
      norm(formData.firstName) === norm(u.firstName) &&
      norm(formData.lastName) === norm(u.lastName) &&
      norm(formData.address) === norm(u.address) &&
      norm(formData.city) === norm(u.city) &&
      norm(formData.state) === norm(u.state) &&
      norm(formData.pincode) === norm(u.pincode) &&
      norm(formData.phone) === norm(u.phone) &&
      norm(formData.email) === norm(u.email) &&
      norm(formData.notes) === norm(u.notes)
    );
  }, [formData, fetchedUser, user]);

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

  const isBillingFormValid = useMemo(() => {
    return missingMandatoryFields.length === 0;
  }, [missingMandatoryFields]);

  const missingDetails = missingMandatoryFields;

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

  // Save or update address & devotee details
  const handleSaveDetails = useCallback(
    async (tokenOverride?: string): Promise<FetchedUserDetails | null> => {


      setIsSaving(true);

      try {
        localStorage.setItem(DEVOTEE_BILLING_STORAGE_KEY, JSON.stringify(formData));
        setHasSavedData(true);
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      const loggedInUserId = user?.id || (user as any)?.user_id;
      const targetUserId = loggedInUserId || fetchedUser?.id;

      const payload: UserSavePayload = {
        id: targetUserId || undefined,
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        notes: formData.notes.trim() || undefined,
      };

      try {
        const savedUser = await saveUserApi(payload, tokenOverride || token || null, targetUserId);
        setFetchedUser(savedUser);
        if (typeof window !== "undefined" && savedUser?.id) {
          localStorage.setItem("devotee_user_id", String(savedUser.id));
          localStorage.setItem("devotee_user", JSON.stringify(savedUser));
        }
        setIsFormSaved(true);
        setSaveMessage({
          type: "success",
          text: "Address details saved successfully to your devotee profile! 🪔",
        });
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
    [formData, token, user, isBillingFormValid, missingMandatoryFields, fetchedUser]
  );

  // Clear saved details
  const handleClearSavedDetails = useCallback(() => {
    try {
      localStorage.removeItem(DEVOTEE_BILLING_STORAGE_KEY);
      localStorage.removeItem("devotee_user_id");
      localStorage.removeItem("devotee_user");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("devotee_user_updated", { detail: null }));
      }
      setHasSavedData(false);
      setIsFormSaved(false);
      setFormData(initialEmptyForm);
      setSaveMessage({
        type: "success",
        text: "Saved details cleared from form.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (e) {
      console.warn("Could not clear saved details:", e);
    }
  }, []);

  // Customer details getters
  const resolvedAddress = (formData.address || fetchedUser?.address || user?.address || "").trim();
  const resolvedEmail = (formData.email || fetchedUser?.email || user?.email || "").trim();
  const resolvedPhone = (formData.phone || fetchedUser?.phone || user?.phone || "").trim();
  const devoteeName =
    `${formData.firstName} ${formData.lastName}`.trim() ||
    fetchedUser?.name ||
    user?.name ||
    (user?.firstname ? `${user.firstname} ${user.lastname || ""}`.trim() : "") ||
    "Devotee";

  // Focus helpers
  const focusFirstMissingField = useCallback(() => {
    const fieldsOrder: { selector: string; invalid: boolean }[] = [
      { selector: 'input[name="firstName"]', invalid: !formData.firstName.trim() },
      { selector: 'input[name="address"]', invalid: !formData.address.trim() },
      { selector: 'input[name="city"]', invalid: !formData.city.trim() },
      { selector: 'input[name="state"]', invalid: !formData.state.trim() },
      {
        selector: 'input[name="pincode"]',
        invalid: !formData.pincode.trim() || formData.pincode.trim().length !== 6,
      },
      {
        selector: 'input[name="phone"]',
        invalid: !formData.phone.trim() || formData.phone.trim().length !== 10,
      },
      {
        selector: 'input[name="email"]',
        invalid: Boolean(
          formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ),
      },
    ];

    const firstInvalid = fieldsOrder.find((f) => f.invalid);
    if (firstInvalid) {
      const el = document.querySelector(firstInvalid.selector) as HTMLInputElement | null;
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

  const value: CheckoutContextType = {
    formData,
    updateFormField,
    setFormData,
    hasSavedData,
    isFormSaved,
    setIsFormSaved,
    isSaving,
    saveMessage,
    setSaveMessage,
    fetchedUser,
    isLoadingUser,
    isDataSame,
    isBillingFormValid,
    missingMandatoryFields,
    missingDetails,
    fetchDevoteeUser,
    handleSaveDetails,
    handleClearSavedDetails,
    resolvedAddress,
    resolvedPhone,
    resolvedEmail,
    devoteeName,
    focusFirstMissingField,
    focusSaveButton,
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
