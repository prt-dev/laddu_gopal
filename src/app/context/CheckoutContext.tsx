"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
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
  fetchedUserBaseline: BillingFormData | null;
  isLoadingUser: boolean;
  isDataSame: boolean;
  fetchDevoteeUser: (phoneOverride?: string, emailOverride?: string) => Promise<FetchedUserDetails | null>;
  handleSaveDetails: (tokenOverride?: string) => Promise<boolean>;
  handleClearSavedDetails: () => void;
  resolvedAddress: string;
  resolvedPhone: string;
  resolvedEmail: string;
  devoteeName: string;
  missingDetails: string[];
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

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { user, token, isAuthenticated } = useWebAuth();

  const [formData, setFormData] = useState<BillingFormData>(initialEmptyForm);
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const [isFormSaved, setIsFormSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fetchedUser, setFetchedUser] = useState<FetchedUserDetails | null>(null);
  const [fetchedUserBaseline, setFetchedUserBaseline] = useState<BillingFormData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  // 1. Initial Load & Baseline Fetching
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      let initialForm = { ...initialEmptyForm };

      // Check localStorage for saved details
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

      // If user is authenticated and form missing some identity fields, prefill from auth context
      if (user) {
        if (!initialForm.firstName && (user.firstname || user.name)) {
          initialForm.firstName = user.firstname || user.name?.split(" ")[0] || "";
        }
        if (!initialForm.lastName && (user.lastname || user.name)) {
          initialForm.lastName = user.lastname || user.name?.split(" ").slice(1).join(" ") || "";
        }
        if (!initialForm.address && user.address) initialForm.address = user.address;
        if (!initialForm.phone && user.phone) initialForm.phone = user.phone;
        if (!initialForm.email && user.email) initialForm.email = user.email;

        if (initialForm.phone || initialForm.email || initialForm.address) {
          if (isMounted) setHasSavedData(true);
          try {
            localStorage.setItem(DEVOTEE_BILLING_STORAGE_KEY, JSON.stringify(initialForm));
          } catch { }
        }
      }

      if (isMounted) {
        setFormData(initialForm);
      }

      // Check saved status flag
      try {
        const savedFlag = localStorage.getItem(DEVOTEE_BILLING_SAVED_STATUS_KEY) === "true";
        if (savedFlag && isMounted) {
          setIsFormSaved(true);
        }
      } catch { }

      // Fetch user from backend before changes to establish server baseline
      const phoneToFetch = (initialForm.phone || user?.phone || "").trim();
      const emailToFetch = (initialForm.email || user?.email || "").trim();

      if (phoneToFetch || emailToFetch || token) {
        if (isMounted) setIsLoadingUser(true);
        try {
          const serverUser = await fetchUserDetailsByPhoneOrEmail(
            { phone: phoneToFetch, email: emailToFetch },
            token || null
          );

          if (serverUser && isMounted) {
            let additional: any = serverUser.additional_details;
            if (typeof additional === "string") {
              try {
                additional = JSON.parse(additional);
              } catch { }
            }

            const baseline: BillingFormData = {
              firstName: (serverUser.firstname || (serverUser.name ? serverUser.name.split(" ")[0] : "") || initialForm.firstName || "").trim(),
              lastName: (serverUser.lastname || (serverUser.name ? serverUser.name.split(" ").slice(1).join(" ") : "") || initialForm.lastName || "").trim(),
              address: (serverUser.address || (additional && typeof additional === "object" ? additional.address : "") || initialForm.address || "").trim(),
              city: (serverUser.city || (additional && typeof additional === "object" ? additional.city : "") || initialForm.city || "").trim(),
              state: (serverUser.state || (additional && typeof additional === "object" ? additional.state : "") || initialForm.state || "").trim(),
              pincode: (serverUser.pincode || (additional && typeof additional === "object" ? additional.pincode : "") || initialForm.pincode || "").trim(),
              phone: (serverUser.phone || initialForm.phone || "").trim(),
              email: (serverUser.email || initialForm.email || "").trim(),
              notes: (serverUser.notes || (additional && typeof additional === "object" ? additional.notes : "") || initialForm.notes || "").trim(),
            };

            setFetchedUser(serverUser);
            setFetchedUserBaseline(baseline);
            setHasSavedData(true);
            setIsFormSaved(true);

            // Populate form with server values if local fields are empty
            setFormData((prev) => ({
              firstName: prev.firstName || baseline.firstName,
              lastName: prev.lastName || baseline.lastName,
              address: prev.address || baseline.address,
              city: prev.city || baseline.city,
              state: prev.state || baseline.state,
              pincode: prev.pincode || baseline.pincode,
              phone: prev.phone || baseline.phone,
              email: prev.email || baseline.email,
              notes: prev.notes || baseline.notes,
            }));

            try {
              localStorage.setItem(DEVOTEE_BILLING_SAVED_STATUS_KEY, "true");
              window.dispatchEvent(
                new CustomEvent("devotee_billing_saved", { detail: { isSaved: true, user: serverUser } })
              );
            } catch { }
          } else if (user && isMounted) {
            // Auth user fallback baseline
            const authBaseline: BillingFormData = {
              firstName: (user.firstname || (user.name ? user.name.split(" ")[0] : "") || initialForm.firstName || "").trim(),
              lastName: (user.lastname || (user.name ? user.name.split(" ").slice(1).join(" ") : "") || initialForm.lastName || "").trim(),
              address: (user.address || initialForm.address || "").trim(),
              city: (initialForm.city || "").trim(),
              state: (initialForm.state || "").trim(),
              pincode: (initialForm.pincode || "").trim(),
              phone: (user.phone || initialForm.phone || "").trim(),
              email: (user.email || initialForm.email || "").trim(),
              notes: (initialForm.notes || "").trim(),
            };
            if (authBaseline.phone || authBaseline.email) {
              setFetchedUserBaseline(authBaseline);
            }
          }
        } catch (err) {
          console.warn("Could not fetch user details before change:", err);
        } finally {
          if (isMounted) setIsLoadingUser(false);
        }
      }
    };

    loadInitialData();

    // Listen for custom event dispatch if external updates occur
    const handleSavedEvent = (e: any) => {
      if (isMounted) {
        setIsFormSaved(Boolean(e.detail?.isSaved));
        if (e.detail?.user) {
          setFetchedUser(e.detail.user);
        }
      }
    };

    window.addEventListener("devotee_billing_saved", handleSavedEvent);
    return () => {
      isMounted = false;
      window.removeEventListener("devotee_billing_saved", handleSavedEvent);
    };
  }, [user, token]);

  // 2. Fetch Devotee User On-Demand Helper
  const fetchDevoteeUser = useCallback(
    async (phoneOverride?: string, emailOverride?: string): Promise<FetchedUserDetails | null> => {
      const phone = (phoneOverride ?? formData.phone ?? user?.phone ?? "").trim();
      const email = (emailOverride ?? formData.email ?? user?.email ?? "").trim();

      if (!phone && !email && !token) return null;

      try {
        const fetched = await fetchUserDetailsByPhoneOrEmail({ phone, email }, token || null);
        if (fetched) {
          setFetchedUser(fetched);
          return fetched;
        }
      } catch (err) {
        console.warn("Error fetching devotee user details in CheckoutContext:", err);
        throw err;
      }
      return null;
    },
    [formData.phone, formData.email, user, token]
  );

  // 3. Dirty Checking: Compare Current Form Data with Server Baseline
  const isDataSame = useMemo(() => {
    if (!fetchedUserBaseline) return false;
    const norm = (str: string = "") => str.trim().toLowerCase();

    return (
      norm(formData.firstName) === norm(fetchedUserBaseline.firstName) &&
      norm(formData.lastName) === norm(fetchedUserBaseline.lastName) &&
      norm(formData.address) === norm(fetchedUserBaseline.address) &&
      norm(formData.city) === norm(fetchedUserBaseline.city) &&
      norm(formData.state) === norm(fetchedUserBaseline.state) &&
      norm(formData.pincode) === norm(fetchedUserBaseline.pincode) &&
      norm(formData.phone) === norm(fetchedUserBaseline.phone) &&
      norm(formData.email) === norm(fetchedUserBaseline.email) &&
      norm(formData.notes) === norm(fetchedUserBaseline.notes)
    );
  }, [formData, fetchedUserBaseline]);

  // 4. Update Form Field
  const updateFormField = useCallback((name: keyof BillingFormData | string, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      try {
        localStorage.setItem(DEVOTEE_BILLING_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(DEVOTEE_BILLING_SAVED_STATUS_KEY, "false");
        window.dispatchEvent(new CustomEvent("devotee_billing_updated", { detail: updated }));
        window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: false } }));
      } catch { }
      return updated;
    });
    setIsFormSaved(false);
  }, []);

  // 5. Save Details to Server
  const handleSaveDetails = useCallback(
    async (tokenOverride?: string): Promise<boolean> => {
      const activeToken = tokenOverride || token;

      if (
        !formData.firstName.trim() ||
        formData.phone.trim().length !== 10 ||
        !formData.email.trim() ||
        !formData.address.trim()
      ) {
        setSaveMessage({
          type: "error",
          text: "Please fill required fields before saving.",
        });
        setTimeout(() => setSaveMessage(null), 4000);
        try {
          localStorage.setItem(DEVOTEE_BILLING_SAVED_STATUS_KEY, "false");
          window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: false } }));
        } catch { }
        return false;
      }

      setIsSaving(true);
      setSaveMessage(null);

      try {
        localStorage.setItem(DEVOTEE_BILLING_STORAGE_KEY, JSON.stringify(formData));
        setHasSavedData(true);
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      const payload: UserSavePayload = {
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        notes: formData.notes.trim() || undefined,
      };

      try {
        const savedUser = await saveUserApi(payload, activeToken || null);

        setFetchedUser(savedUser);
        setFetchedUserBaseline({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          notes: formData.notes.trim(),
        });
        setIsFormSaved(true);

        setSaveMessage({
          type: "success",
          text: "Address details saved successfully to your devotee profile! 🪔",
        });
        setTimeout(() => setSaveMessage(null), 4000);

        try {
          localStorage.setItem(DEVOTEE_BILLING_SAVED_STATUS_KEY, "true");
          window.dispatchEvent(
            new CustomEvent("devotee_billing_saved", { detail: { isSaved: true, user: savedUser } })
          );
        } catch { }
        return true;
      } catch (err: any) {
        console.warn("User Save API error:", err);
        setSaveMessage({
          type: "error",
          text: err?.message || "Could not save address to server. Please try again.",
        });
        setTimeout(() => setSaveMessage(null), 5000);

        try {
          localStorage.setItem(DEVOTEE_BILLING_SAVED_STATUS_KEY, "false");
          window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: false } }));
        } catch { }
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [formData, token]
  );

  // 6. Clear Details
  const handleClearSavedDetails = useCallback(() => {
    try {
      localStorage.removeItem(DEVOTEE_BILLING_STORAGE_KEY);
      localStorage.setItem(DEVOTEE_BILLING_SAVED_STATUS_KEY, "false");
      window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: false } }));
      setHasSavedData(false);
      setIsFormSaved(false);
      setFetchedUserBaseline(null);
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

  // 7. Resolved Customer Details & Missing Validations
  const resolvedAddress = useMemo(() => {
    return (
      formData.address ||
      fetchedUser?.address ||
      (fetchedUser?.additional_details && typeof fetchedUser.additional_details === "object"
        ? fetchedUser.additional_details.address
        : "") ||
      user?.address ||
      ""
    ).trim();
  }, [formData.address, fetchedUser, user?.address]);

  const resolvedEmail = useMemo(() => {
    return (formData.email || fetchedUser?.email || user?.email || "").trim();
  }, [formData.email, fetchedUser?.email, user?.email]);

  const resolvedPhone = useMemo(() => {
    return (formData.phone || fetchedUser?.phone || user?.phone || "").trim();
  }, [formData.phone, fetchedUser?.phone, user?.phone]);

  const devoteeName = useMemo(() => {
    const fromForm = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
    if (fromForm) return fromForm;
    if (fetchedUser?.name) return fetchedUser.name;
    if (user?.name) return user.name;
    if (user?.firstname) return `${user.firstname} ${user.lastname || ""}`.trim();
    return "Devotee";
  }, [formData.firstName, formData.lastName, fetchedUser?.name, user]);

  const missingDetails = useMemo(() => {
    const missing: string[] = [];
    if (!resolvedEmail) missing.push("Email Address");
    if (!resolvedPhone || resolvedPhone.length < 10) missing.push("10-digit Mobile Number");
    if (!resolvedAddress) missing.push("Delivery Address");
    return missing;
  }, [resolvedEmail, resolvedPhone, resolvedAddress]);

  // 8. Focus Helpers
  const focusFirstMissingField = useCallback(() => {
    if (!resolvedPhone || resolvedPhone.length < 10) {
      const el = document.querySelector('input[name="phone"]') as HTMLInputElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    } else if (!resolvedAddress) {
      const el = document.querySelector('input[name="address"]') as HTMLInputElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    } else if (!resolvedEmail) {
      const el = document.querySelector('input[name="email"]') as HTMLInputElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus();
    }
  }, [resolvedPhone, resolvedAddress, resolvedEmail]);

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
    fetchedUserBaseline,
    isLoadingUser,
    isDataSame,
    fetchDevoteeUser,
    handleSaveDetails,
    handleClearSavedDetails,
    resolvedAddress,
    resolvedPhone,
    resolvedEmail,
    devoteeName,
    missingDetails,
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
