"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWebAuth } from "@/app/context/WebAuthContext";
import {
  useCheckout,
} from "@/app/context/CheckoutContext";
import { createOrderApi, createRazorpayOrderApi, OrderItem } from "@/app/services/orderService";
import {
  createPaymentApi,
  verifyRazorpayPaymentApi,
} from "@/app/services/paymentService";
import Loading from "@/app/components/common/Loading";
import { FetchedUserDetails } from "@/app/services/userService";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutOrderSummary() {
  const {
    items,
    isLoading,
    subtotal,
    clearCart,
    cartId,
    cart_id,
    getLatestCartByUserId,
    createOrUpdateCart,
  } = useCart();
  const { token, user } = useWebAuth();
  const {
    formData,
    fetchedUser,
    fetchDevoteeUser,
    isBillingFormValid,
    missingMandatoryFields,
    resolvedAddress,
    resolvedPhone,
    resolvedEmail,
    devoteeName,
    focusFirstMissingField,
    handleSaveDetails,
  } = useCheckout();

  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    if (!billingError) return;
    const timer = setTimeout(() => {
      setBillingError(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [billingError]);

  const handlePlaceOrder = async () => {
    setBillingError(null);
    setIsPlacingOrder(true);

    // 1. Check mandatory inputs using billing form flag
    if (!isBillingFormValid) {
      setBillingError(
        `Please provide complete billing details before placing order: Missing or invalid ${missingMandatoryFields.join(", ")}.`
      );
      focusFirstMissingField();
      setIsPlacingOrder(false);
      return;
    }

    try {
      const phone = formData.phone.trim();
      const email = formData.email.trim();

      // Step 1: Save or update billing form data on server
      let activeUser: FetchedUserDetails | null = null;
      try {
        activeUser = await handleSaveDetails(token || undefined);
      } catch (saveErr) {
        console.warn("Could not save billing details to server:", saveErr);
      }

      // If activeUser is not yet resolved, fallback to checking devotee user profile by phone or email
      if (!activeUser?.id) {
        try {
          activeUser = await fetchDevoteeUser(phone, email);
        } catch (fetchErr) {
          console.warn("Could not fetch devotee profile by phone/email:", fetchErr);
        }
      }

      const resolvedUserId = activeUser?.id
        ? Number(activeUser.id)
        : fetchedUser?.id
          ? Number(fetchedUser.id)
          : undefined;

      // Step 2: Add or update cart data on server with resolved user ID
      let resolvedCartId = cartId || cart_id;
      if (resolvedUserId) {
        try {
          const syncdCart = await createOrUpdateCart(resolvedUserId);
          if (syncdCart?.id && !isNaN(Number(syncdCart.id))) {
            resolvedCartId = Number(syncdCart.id);
          }
        } catch (cartErr) {
          console.warn("createOrUpdateCart on order place error:", cartErr);
        }

        if (!resolvedCartId) {
          try {
            const latestCart = await getLatestCartByUserId(resolvedUserId);
            if (latestCart?.id) {
              resolvedCartId = Number(latestCart.id);
            }
          } catch (cartFetchErr) {
            console.warn("Could not fetch latest cart by user_id from CartContext:", cartFetchErr);
          }
        }
      }

      // Step 3: Then place order
      const totalOrderAmount = Number(subtotal.toFixed(2));

      if (paymentMethod === "cod") {
        try {
          const createdOrder = await createOrderApi(
            {
              amount: totalOrderAmount,
              currency: "INR",
              status: "pending",
              phone: resolvedPhone || phone,
              email: resolvedEmail || email,
              username: devoteeName,
              user_id: resolvedUserId,
              cart_id: resolvedCartId,
              products: items && items.length > 0 ? items : undefined,
            },
            token || null
          );

          try {
            await clearCart();
          } catch (clearErr) {
            console.warn("Could not clear cart after COD order:", clearErr);
          } finally {
            setCompletedOrder(createdOrder);
          }
        } catch (codErr: any) {
          console.error("Failed to place Cash on Delivery order:", codErr);
          setBillingError(codErr?.message || "Could not place Cash on Delivery order. Please try again.");
        } finally {
          setIsPlacingOrder(false);
        }
        return;
      }

      // 4. Online Payment (Razorpay UPI / Cards / Net Banking)
      let scriptLoaded = false;
      try {
        scriptLoaded = await loadRazorpayScript();
      } catch (scriptErr) {
        console.warn("Error loading Razorpay script:", scriptErr);
      } finally {
        if (!scriptLoaded) {
          setBillingError("Could not load secure payment gateway. Please check your internet connection.");
          setIsPlacingOrder(false);
        }
      }
      if (!scriptLoaded) return;

      let createdOrder: OrderItem | null = null;
      try {
        createdOrder = await createRazorpayOrderApi(
          {
            amount: totalOrderAmount,
            currency: "INR",
            status: "pending",
            phone: resolvedPhone || phone,
            email: resolvedEmail || email,
            username: devoteeName,
            user_id: resolvedUserId,
            cart_id: resolvedCartId,
            products: items && items.length > 0 ? items : undefined,
          },
          token || null
        );
      } catch (orderErr: any) {
        console.error("Razorpay order creation error:", orderErr);
        setBillingError(orderErr?.message || "Failed to initiate online order with payment gateway.");
      } finally {
        if (!createdOrder) {
          setIsPlacingOrder(false);
        }
      }

      if (!createdOrder) {
        if (!billingError) setBillingError("Could not create order.");
        setIsPlacingOrder(false);
        return;
      }

      const rzpKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TY0c6RcNQTqpoI";

      const options: any = {
        key: rzpKey || createdOrder?.order_number,
        order_id: createdOrder?.razorpay_order_id || undefined,
        amount: Math.round(totalOrderAmount * 100), // in paise
        currency: "INR",
        name: "Makhan Chor - Laddu Gopal",
        description: `Sacred Order #${createdOrder.order_number || createdOrder.id}`,
        image: "/assets/best-selling.png",
        prefill: {
          name: devoteeName,
          email: resolvedEmail,
          contact: resolvedPhone,
        },
        notes: {
          address: resolvedAddress,
          order_id: String(createdOrder.id || ""),
          order_number: createdOrder.order_number || "",
        },
        theme: {
          color: "#d20b4f",
        },
        handler: async function (response: any) {
          setIsPlacingOrder(true);
          try {
            if (response.razorpay_signature) {
              await verifyRazorpayPaymentApi(
                {
                  order_id: createdOrder!.id,
                  razorpay_order_id: response.razorpay_order_id || createdOrder!.razorpay_order_id || "",
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                token || null
              );
            } else {
              await createPaymentApi(
                {
                  order_id: Number(createdOrder?.id),
                  amount: totalOrderAmount,
                  currency: "INR",
                  status: "captured",
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id || undefined,
                },
                token || null
              );
            }

            try {
              await clearCart();
            } catch (cartErr) {
              console.warn("Could not clear cart:", cartErr);
            } finally {
              setCompletedOrder({
                ...createdOrder!,
                status: "paid",
              });
            }
          } catch (payErr: any) {
            console.warn("Payment verification backend sync:", payErr);
            setBillingError(payErr?.message || "Payment verification failed. Please contact support.");
          } finally {
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsPlacingOrder(false);
          },
        },
      };

      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          console.error("Razorpay payment failed:", resp.error);
          setBillingError(`Payment was declined: ${resp.error?.description || "Transaction failed"}`);
          setIsPlacingOrder(false);
        });
        rzp.open();
      } catch (modalErr: any) {
        console.error("Failed to open Razorpay modal:", modalErr);
        setBillingError("Could not open payment checkout modal. Please try again.");
        setIsPlacingOrder(false);
      } finally {
        // modal open attempt completed
      }
    } catch (err: any) {
      console.error("Failed to place sacred order:", err);
      setBillingError(err.message || "Could not place order at this time. Please try again.");
      setIsPlacingOrder(false);
    } finally {
      // General place order execution complete
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

  // 2. Completed Order Sacred Confirmation
  if (completedOrder) {
    const isPaid = completedOrder.status === "paid";
    return (
      <div className="w-full lg:w-5/12 rounded-xl border-2 border-amber-300 bg-[#fffdf0] p-6 shadow-md text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 text-3xl">
          ✓
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-amber-200 text-amber-900 mb-2">
            Jai Shri Krishna!
          </span>
          <h3 className="heading-font text-xl font-extrabold text-[#d20b4f]">
            Sacred Order Placed Successfully
          </h3>
          <p className="text-xs text-gray-700 mt-1">
            May Laddu Gopal bless your home with divine happiness, peace and abundance.
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 border border-amber-200 text-left space-y-2 text-xs">
          <div className="flex justify-between border-b border-amber-100 pb-2">
            <span className="text-gray-500 font-semibold">Order Number:</span>
            <span className="font-mono font-bold text-[#d20b4f]">
              {completedOrder.order_number || `#${completedOrder.id}`}
            </span>
          </div>
          <div className="flex justify-between border-b border-amber-100 pb-2">
            <span className="text-gray-500 font-semibold">Total Amount:</span>
            <span className="font-bold text-black">
              ₹{Number(completedOrder.amount || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-b border-amber-100 pb-2">
            <span className="text-gray-500 font-semibold">Payment Status:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] ${isPaid
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
                }`}
            >
              {isPaid ? "Paid Online (Captured)" : "Cash on Delivery (Pending)"}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-gray-500 font-semibold">Delivery Seva:</span>
            <span className="text-emerald-700 font-bold">Standard Free Seva</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-block w-full rounded bg-[#d20b4f] py-3 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#b80943] transition no-underline shadow-xs"
          >
            Continue Divine Shopping &rarr;
          </Link>
        </div>
      </div>
    );
  }

  // 3. Empty / Not Found State
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

  // 4. Active Order Summary
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
          { id: "cod", label: "Cash on Delivery (COD)" },
        ].map((m) => (
          <label
            key={m.id}
            className={`flex items-center gap-2 rounded bg-white p-2.5 text-xs font-bold text-black cursor-pointer border transition ${paymentMethod === m.id
              ? "border-[#d20b4f] ring-1 ring-[#d20b4f]/30 bg-pink-50/20"
              : "border-[#fff0ad] hover:border-[#d20b4f]/40"
              }`}
          >
            <input
              type="radio"
              name="payment"
              value={m.id}
              checked={paymentMethod === m.id}
              onChange={() => setPaymentMethod(m.id as any)}
              className="text-[#d20b4f] focus:ring-[#d20b4f]"
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
      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full rounded bg-[#d20b4f] py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#b80943] border-0 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPlacingOrder && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {isPlacingOrder
            ? paymentMethod === "cod"
              ? "Placing Sacred Order..."
              : "Connecting to Secure Gateway..."
            : paymentMethod === "cod"
              ? "Place Sacred Order (Cash on Delivery)"
              : "Pay & Place Sacred Order"}
        </button>
      </div>
    </div>
  );
}
