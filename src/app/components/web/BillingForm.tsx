"use client";

import React, { useState, useEffect, useCallback } from "react";
import SaveDetailsButton from "./SaveDetailsButton";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { saveUserApi, UserSavePayload } from "@/app/services/userService";

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

export const DEVOTEE_BILLING_STORAGE_KEY = "devotee_billing_details";
const STORAGE_KEY = DEVOTEE_BILLING_STORAGE_KEY;

export default function BillingForm() {

  const { isAuthenticated, token, user } = useWebAuth();

  const [formData, setFormData] = useState<BillingFormData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      try {
        const parsedData: BillingFormData = JSON.parse(savedData);

        setFormData((prev) => ({
          ...prev,
          ...parsedData,
        }));
        if (parsedData.address || parsedData.phone || parsedData.email) {
          setHasSavedData(true);
        }
      } catch (error) {
        console.error("Invalid billing form data:", error);
      }
    } else if (user) {

      const prefill: BillingFormData = {
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        address: user.address || "",
        city: "",
        state: "",
        pincode: "",
        phone: user.phone || "",
        email: user.email || "",
        notes: "",
      };
      setFormData(prefill);
      if (prefill.phone || prefill.email || prefill.address) {
        setHasSavedData(true);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(prefill));
        } catch { }
      }
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem("devotee_billing_saved_status", "false");
        window.dispatchEvent(new CustomEvent("devotee_billing_updated", { detail: updated }));
        window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: false } }));
      } catch { }
      return updated;
    });
  };

  const handleSaveDetails = useCallback(async (token?: string): Promise<boolean> => {
    if (!formData.firstName.trim() || formData.phone.length != 10 || !formData.email.trim() || !formData.address.trim()) {
      setSaveMessage({
        type: "error",
        text: "Please fill required fields before saving.",
      });
      setTimeout(() => setSaveMessage(null), 4000);
      try {
        localStorage.setItem("devotee_billing_saved_status", "false");
        window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: false } }));
      } catch { }
      return false;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
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
      const savedUser = await saveUserApi(
        payload,
        token || null,
      );

      setSaveMessage({
        type: "success",
        text: "Address details saved successfully to your devotee profile! 🪔",
      });
      setTimeout(() => setSaveMessage(null), 4000);
      try {
        localStorage.setItem("devotee_billing_saved_status", "true");
        window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: true, user: savedUser } }));
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
        localStorage.setItem("devotee_billing_saved_status", "false");
        window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: false } }));
      } catch { }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData]);

  // Clear saved details
  const handleClearSavedDetails = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem("devotee_billing_saved_status", "false");
      window.dispatchEvent(new CustomEvent("devotee_billing_saved", { detail: { isSaved: false } }));
      setHasSavedData(false);
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        email: "",
        notes: "",
      });
      setSaveMessage({
        type: "success",
        text: "Saved details cleared from form.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (e) {
      console.warn("Could not clear saved details:", e);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
      {/* First Name + Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            First Name<sup className="text-[#d20b4f]">*</sup>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="e.g. Radhika"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            Last Name<sup className="text-[#d20b4f]">*</sup>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="e.g. Sharma"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-bold text-black mb-1">
          Complete Delivery Address<sup className="text-[#d20b4f]">*</sup>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="House / Flat No., Building, Street Name, Area / Landmark"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
        />
      </div>

      {/* Town/City + State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            Town / City<sup className="text-[#d20b4f]">*</sup>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Kolkata / Mumbai / Delhi"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            State<sup className="text-[#d20b4f]">*</sup>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g. West Bengal / Delhi"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
          />
        </div>
      </div>

      {/* Pincode + Mobile / WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            PIN Code<sup className="text-[#d20b4f]">*</sup>
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="e.g. 743145"
            maxLength={6}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            Mobile / WhatsApp Number<sup className="text-[#d20b4f]">*</sup>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 8013395004"
            maxLength={10}
            minLength={10}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
          />
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs font-bold text-black mb-1">
          Email Address<sup className="text-[#d20b4f]">*</sup>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="yourname@example.com (For order receipt & tracking updates)"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
        />
      </div>

      {/* Special Devotional Instructions */}
      <div>
        <label className="block text-xs font-bold text-black mb-1">
          Special Devotional Instructions (Optional)
        </label>
        <textarea
          rows={2}
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
          placeholder="e.g. Please include extra mor pankh or specific deity idol size note..."
        />
      </div>

      {/* Save Details Action & Feedback */}
      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <SaveDetailsButton
            id="save-address-btn"
            type="button"
            loading={isSaving}
            onClick={() => handleSaveDetails(token || undefined)}
            label="Save Address"
          />

          {hasSavedData && (
            <div className="flex items-center gap-2 rounded-lg bg-[#fff0ad]/40 border border-[#d20b4f]/20 px-3 py-1.5 text-xs text-gray-800">
              <span className="font-bold text-[#d20b4f] flex items-center gap-1">
                <span>✓</span>
                <span>
                  {isAuthenticated ? "Devotee profile address loaded" : "Saved delivery details loaded"}
                </span>
              </span>
              <span className="text-gray-400">|</span>
              <button
                type="button"
                onClick={handleClearSavedDetails}
                className="text-[11px] font-bold text-gray-600 hover:text-[#d20b4f] underline cursor-pointer border-0 bg-transparent p-0"
              >
                Clear Form
              </button>
            </div>
          )}
        </div>

        {saveMessage && (
          <p
            className={`text-xs font-semibold ${saveMessage.type === "success" ? "text-green-700" : "text-red-600"
              }`}
          >
            {saveMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}
