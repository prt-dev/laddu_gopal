"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import Loading from "@/app/components/common/Loading";

export default function CheckoutOrderSummary() {
  const { items, isLoading, subtotal, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      // Clear cart items from localStorage & backend on order placement
      await clearCart();
      alert("Blessings! Your sacred order has been submitted successfully for divine packing and dispatch.");
    } catch (err) {
      console.error("Failed to clear cart upon placing order:", err);
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
        {items.map((item, i) => (
          <div key={`${item.id}-${item.variant || item.size || i}`} className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="h-11 w-11 rounded bg-white p-1 flex items-center justify-center flex-shrink-0 border border-[#fff0ad]">
                <img
                  src={item.img}
                  className="h-full w-full object-contain"
                  alt={item.name}
                />
              </div>
              <div>
                <h6 className="heading-font text-xs font-bold text-black mb-0.5" title={item.name}>
                  {item.name}
                  {(item.variant || item.size) && (
                    <span className="text-[10px] text-[#d20b4f] ml-1">
                      ({item.variant || item.size})
                    </span>
                  )}
                </h6>
                <span className="text-[10px] text-gray-700 font-semibold">
                  Qty: {item.quantity} &bull; ₹{item.price.toFixed(2)} each
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#d20b4f] whitespace-nowrap ml-2">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
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

      {/* Place Order button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full rounded bg-[#d20b4f] py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#b80943] border-0 cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isPlacingOrder ? "Placing Sacred Order..." : "Place Sacred Order"}
        </button>
      </div>
    </div>
  );
}
