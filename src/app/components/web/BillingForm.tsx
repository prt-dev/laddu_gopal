"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useWebAuth } from "@/app/context/WebAuthContext";
import {
  useCheckout,
  BillingFormData,
  DEVOTEE_BILLING_STORAGE_KEY,
} from "@/app/context/CheckoutContext";
import {
  ALL_INDIAN_STATES,
  getCitiesForState,
} from "@/app/data/indianStatesCities";

export type { BillingFormData };
export { DEVOTEE_BILLING_STORAGE_KEY };

export default function BillingForm() {
  const { isAuthenticated } = useWebAuth();
  const {
    formData,
    updateFormField,
    hasSavedData,
    saveMessage,
    handleClearSavedDetails,
  } = useCheckout();

  // Dynamic cities based on chosen Indian State
  const availableCities = useMemo(() => {
    return getCitiesForState(formData.state);
  }, [formData.state]);

  const isCityInList = useMemo(() => {
    if (!formData.city || availableCities.length === 0) return false;
    return availableCities.some(
      (c) => c.toLowerCase() === formData.city.trim().toLowerCase()
    );
  }, [formData.city, availableCities]);

  const [isOtherCitySelected, setIsOtherCitySelected] = useState<boolean>(false);

  useEffect(() => {
    if (!formData.city) {
      setIsOtherCitySelected(false);
    } else if (availableCities.length > 0 && !isCityInList) {
      setIsOtherCitySelected(true);
    }
  }, [formData.city, availableCities, isCityInList]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    updateFormField("state", newState);
    updateFormField("city", "");
    setIsOtherCitySelected(false);
  };

  const handleCitySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsOtherCitySelected(true);
      updateFormField("city", "");
    } else {
      setIsOtherCitySelected(false);
      updateFormField("city", val);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormField(name, value);
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
            Last Name (Optional)
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="e.g. Sharma"
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

      {/* State + Town/City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            State<sup className="text-[#d20b4f]">*</sup>
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleStateChange}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition bg-white cursor-pointer"
          >
            <option value="">-- Select Indian State / UT --</option>
            {ALL_INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-black mb-1">
            Town / City<sup className="text-[#d20b4f]">*</sup>
          </label>
          {availableCities.length > 0 ? (
            <div className="space-y-2">
              <select
                name="citySelect"
                value={isOtherCitySelected ? "Other" : (isCityInList ? formData.city : "")}
                onChange={handleCitySelectChange}
                required={!isOtherCitySelected}
                className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition bg-white cursor-pointer"
              >
                <option value="">-- Select City in {formData.state} --</option>
                {availableCities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>

              {isOtherCitySelected && (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your town, tehsil, or village name..."
                  required
                  autoFocus
                  className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
                />
              )}
            </div>
          ) : (
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={formData.state ? "Enter your city/town" : "Please select State first"}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden transition"
            />
          )}
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
          Email Address (Optional)
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="yourname@example.com (For order receipt & tracking updates)"
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

      {/* Saved Details Status & Clear Form */}
      {(hasSavedData || saveMessage) && (
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
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
      )}
    </div>
  );
}
