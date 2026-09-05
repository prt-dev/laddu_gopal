"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWebAuth } from "@/app/context/WebAuthContext";
import {
  fetchUserDetailsByPhoneOrEmail,
  saveUserApi,
  DEVOTEE_BILLING_STORAGE_KEY,
} from "@/app/services/userService";
import Loading from "@/app/components/common/Loading";

export default function CheckoutOrderSummary() {
  const { items, isLoading, subtotal, clearCart } = useCart();
  const { token, user } = useWebAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [billingError, setBillingError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    setBillingError(null);
    setIsPlacingOrder(true);

    try {
      // 1. Gather current billing details from localStorage, live DOM inputs, and user auth
      let currentBilling: Record<string, string> = {};

      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(DEVOTEE_BILLING_STORAGE_KEY);
          if (raw) currentBilling = JSON.parse(raw);
        } catch (e) {
          console.warn("Failed to parse billing details from storage:", e);
        }

        // Check live input values in the DOM for real-time form state
        const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement | null;
        const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement | null;
        const addressInput = document.querySelector('input[name="address"]') as HTMLInputElement | null;
        const firstNameInput = document.querySelector('input[name="firstName"]') as HTMLInputElement | null;
        const lastNameInput = document.querySelector('input[name="lastName"]') as HTMLInputElement | null;
        const cityInput = document.querySelector('input[name="city"]') as HTMLInputElement | null;
        const stateInput = document.querySelector('input[name="state"]') as HTMLInputElement | null;
        const pincodeInput = document.querySelector('input[name="pincode"]') as HTMLInputElement | null;
        const notesInput = document.querySelector('textarea[name="notes"]') as HTMLTextAreaElement | null;

        if (phoneInput?.value) currentBilling.phone = phoneInput.value.trim();
        if (emailInput?.value) currentBilling.email = emailInput.value.trim();
        if (addressInput?.value) currentBilling.address = addressInput.value.trim();
        if (firstNameInput?.value) currentBilling.firstName = firstNameInput.value.trim();
        if (lastNameInput?.value) currentBilling.lastName = lastNameInput.value.trim();
        if (cityInput?.value) currentBilling.city = cityInput.value.trim();
        if (stateInput?.value) currentBilling.state = stateInput.value.trim();
        if (pincodeInput?.value) currentBilling.pincode = pincodeInput.value.trim();
        if (notesInput?.value) currentBilling.notes = notesInput.value.trim();
      }

      // Check if user is logged in
      if (user) {
        if (!currentBilling.email && user.email) currentBilling.email = user.email;
        if (!currentBilling.phone && user.phone) currentBilling.phone = user.phone;
        if (!currentBilling.address && user.address) currentBilling.address = user.address;
      }

      const phone = (currentBilling.phone || "").trim();
      const email = (currentBilling.email || "").trim();

      // Ensure at least phone or email is supplied before calling fetch user details
      if (!phone && !email) {
        const msg = "Please enter your Mobile Number and Email Address in the delivery address form.";
        setBillingError(msg);
        const phoneEl = document.querySelector('input[name="phone"]') as HTMLInputElement | null;
        phoneEl?.scrollIntoView({ behavior: "smooth", block: "center" });
        phoneEl?.focus();
        setIsPlacingOrder(false);
        return;
      }

      // 2. Fetch user details by phone or email from backend
      const fetchedUser = await fetchUserDetailsByPhoneOrEmail(
        { phone, email },
        token || null
      );

      // Resolve address, email, and phone across live form, fetched user details, and additional_details
      const resolvedAddress = (
        currentBilling.address ||
        fetchedUser?.address ||
        (fetchedUser?.additional_details && typeof fetchedUser.additional_details === "object"
          ? fetchedUser.additional_details.address
          : "") ||
        ""
      ).trim();

      const resolvedEmail = (
        email ||
        fetchedUser?.email ||
        ""
      ).trim();

      const resolvedPhone = (
        phone ||
        fetchedUser?.phone ||
        ""
      ).trim();

      // 3. Verify all essential billing details (email, phone, address) are present
      const missingDetails: string[] = [];
      if (!resolvedEmail) missingDetails.push("Email Address");
      if (!resolvedPhone || resolvedPhone.length < 10) missingDetails.push("10-digit Mobile Number");
      if (!resolvedAddress) missingDetails.push("Delivery Address");

      if (missingDetails.length > 0) {
        const errorMsg = `Please provide complete billing details before placing order: Missing ${missingDetails.join(", ")}.`;
        setBillingError(errorMsg);

        // Highlight and focus the first missing field
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

        setIsPlacingOrder(false);
        return;
      }

      // 4. Save/upsert user billing details to backend database via POST /api/v1/users/save
      try {
        await saveUserApi(
          {
            firstname: currentBilling.firstName || fetchedUser?.firstname || "",
            lastname: currentBilling.lastName || fetchedUser?.lastname || "",
            name: `${currentBilling.firstName || ""} ${currentBilling.lastName || ""}`.trim() || fetchedUser?.name || "",
            phone: resolvedPhone,
            email: resolvedEmail,
            address: resolvedAddress,
            city: currentBilling.city || fetchedUser?.city || "",
            state: currentBilling.state || fetchedUser?.state || "",
            pincode: currentBilling.pincode || fetchedUser?.pincode || "",
            notes: currentBilling.notes || undefined,
          },
          token || null
        );
      } catch (saveErr) {
        console.warn("Could not sync user details during checkout:", saveErr);
      }

      // 5. Clear cart items from localStorage & backend on successful order placement
      await clearCart();
      alert("Blessings! Your sacred order has been submitted successfully for divine packing and dispatch.");
    } catch (err) {
      console.error("Failed to place sacred order:", err);
      setBillingError("Could not place order at this time. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // 1. Loading State with Logo Loader
  if (isLoading) {
    return (
      <div className="w-full lg:w-5/12 rounded border border-[#fff0ad] bg-[#fff0ad]/40 p-6 flex flex-col items-center justify-center text-center shadow-xs">
        <Loading
          variant="container"
          size="md"
          message="Loading your sacred order summary..."
        />
      </div>
    );
  }

  // 2. Empty / Not Found State
  if (items.length === 0) {
    return (
      <div className="w-full lg:w-5/12 rounded border border-[#fff0ad] bg-[#fff0ad]/30 p-8 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="h-16 w-16 rounded-full bg-[#fff0ad] flex items-center justify-center mb-3 text-[#d20b4f]">
          <i className="fa fa-shopping-basket text-2xl" />
        </div>
        <h4 className="heading-font text-lg font-bold text-black mb-1">
          No Items for Checkout
        </h4>
        <p className="text-xs text-gray-600 mb-5 max-w-xs">
          Your basket is empty. Please select sacred poshak or accessories to proceed with checkout.
        </p>
        <Link
          href="/shop"
          className="rounded bg-[#d20b4f] px-5 py-2 text-xs font-bold text-white hover:bg-[#b80943] transition no-underline shadow-xs"
        >
          Explore Divine Collection &rarr;
        </Link>
      </div>
    );
  }

  // 3. Active Order Summary
  return (
    <div className="w-full lg:w-5/12 rounded border border-[#fff0ad] bg-[#fff0ad] p-5 sm:p-6 shadow-xs">
      <h3 className="heading-font text-lg font-bold text-[#d20b4f] mb-4 border-b border-[#d20b4f]/20 pb-2">
        Order Summary
      </h3>

      {/* Items list */}
      <div className="space-y-3 divide-y divide-[#d20b4f]/10 max-h-72 overflow-y-auto pr-1">
        {items.map((item, i) => {
          const itemPrice =
            typeof item.price === "number"
              ? item.price
              : parseFloat(String(item.price || "0").replace(/[^0-9.]/g, "")) || 0;
          const itemQty = Number(item.quantity) || 1;
          const itemImg = item.img || item.product?.img || item.product?.image_url || "/assets/best-selling.png";
          const itemName = item.name || item.product?.name || "Sacred Item";
          const itemVariant = item.variant || item.size;

          return (
            <div
              key={`${item.id ?? item.product_id ?? i}-${itemVariant || ""}`}
              className="flex items-center justify-between pt-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-11 w-11 rounded bg-white p-1 flex items-center justify-center flex-shrink-0 border border-[#fff0ad]">
                  <img
                    src={itemImg}
                    className="h-full w-full object-contain"
                    alt={itemName}
                  />
                </div>
                <div>
                  <h6 className="heading-font text-xs font-bold text-black mb-0.5" title={itemName}>
                    {itemName}
                    {itemVariant && (
                      <span className="text-[10px] text-[#d20b4f] ml-1">
                        ({itemVariant})
                      </span>
                    )}
                  </h6>
                  <span className="text-[10px] text-gray-700 font-semibold">
                    Qty: {itemQty} &bull; ₹{itemPrice.toFixed(2)} each
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#d20b4f] whitespace-nowrap ml-2">
                ₹{(itemPrice * itemQty).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Price breakdown */}
      <div className="mt-5 border-t border-[#d20b4f]/20 pt-3 space-y-1.5 text-xs text-black font-bold">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery:</span>
          <span className="text-green-700">Free Seva Delivery</span>
        </div>
        <div className="border-t border-[#d20b4f]/20 pt-2 flex justify-between items-center text-sm">
          <span className="text-black">Total Payable:</span>
          <span className="text-[#d20b4f] text-base font-extrabold">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment methods */}
      <div className="mt-6 space-y-2">
        <h4 className="heading-font text-xs font-bold text-[#d20b4f] mb-2">
          Select Payment Method:
        </h4>

        {[
          { id: "upi", label: "Instant UPI (Google Pay, PhonePe, Paytm, QR)" },
          { id: "card", label: "Credit / Debit Card / Net Banking" },
          { id: "cod", label: "Cash on Delivery (COD)" },
        ].map((m, idx) => (
          <label
            key={m.id}
            className="flex items-center gap-2 rounded bg-white p-2 text-xs font-bold text-black cursor-pointer border border-[#fff0ad] hover:border-[#d20b4f]/40 transition"
          >
            <input
              type="radio"
              name="payment"
              defaultChecked={idx === 0}
              className="text-[#d20b4f]"
            />
            <span>{m.label}</span>
          </label>
        ))}
      </div>

      {/* Error / Validation Feedback */}
      {billingError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700 flex items-start gap-2 shadow-xs">
          <span className="text-red-500 font-bold text-sm leading-none">&times;</span>
          <span className="flex-1">{billingError}</span>
        </div>
      )}

      {/* Place Order button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full rounded bg-[#d20b4f] py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#b80943] border-0 cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isPlacingOrder ? "Verifying & Placing Sacred Order..." : "Place Sacred Order"}
        </button>
      </div>
    </div>
  );
}
