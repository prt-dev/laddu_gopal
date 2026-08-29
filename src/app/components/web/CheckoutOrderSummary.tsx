"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { getMyCartApi, CartItem } from "@/app/services/cartService";
import { getProductById } from "@/app/services/productService";

interface OrderSummaryItem {
  id: number;
  img: string;
  name: string;
  variant?: string;
  price: number;
  qty: number;
  total: number;
}

export default function CheckoutOrderSummary() {
  const { token, isAuthenticated } = useWebAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<OrderSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  const fetchOrderItems = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getMyCartApi(token);
      const cartList: CartItem[] =
        response.items || response.carts || (Array.isArray(response) ? response : []);

      if (cartList && cartList.length > 0) {
        const mapped: OrderSummaryItem[] = await Promise.all(
          cartList.map(async (c: CartItem) => {
            const localProd = c.product_id ? await getProductById(c.product_id) : null;
            const price =
              Number(c.price) ||
              (localProd
                ? typeof localProd.price === "number"
                  ? localProd.price
                  : parseFloat(String(localProd.price).replace(/[^0-9.]/g, "")) || 0
                : 0);
            const qty = c.quantity || 1;
            const variant = c.variant ? ` (${c.variant})` : "";

            return {
              id: Number(c.id || c.product_id || Math.random()),
              img:
                (c.product?.image_url as string) ||
                localProd?.img ||
                localProd?.image_url ||
                "/assets/best-selling.png",
              name: `${(c.product?.name as string) || localProd?.name || "Devotional Item"}${variant}`,
              variant: c.variant,
              price,
              qty,
              total: price * qty,
            };
          })
        );
        setItems(mapped);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn("Could not fetch checkout order items:", err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    async function loadItems() {
      if (isAuthenticated && token) {
        await fetchOrderItems();
      } else {
        const urlItemId = searchParams.get("item");
        const urlSize = searchParams.get("size");
        if (urlItemId) {
          try {
            const found = await getProductById(Number(urlItemId));
            if (found && isMounted) {
              const price =
                typeof found.price === "number"
                  ? found.price
                  : parseFloat(String(found.price).replace(/[^0-9.]/g, "")) || 0;
              const variant = urlSize ? ` (${urlSize})` : "";
              const directItem: OrderSummaryItem = {
                id: found.id || Number(urlItemId),
                img: found.img || found.image_url || "/assets/best-selling.png",
                name: `${found.name || "Devotional Item"}${variant}`,
                variant: urlSize || undefined,
                price,
                qty: 1,
                total: price,
              };
              setItems([directItem]);
            }
          } catch (e) {
            console.error(e);
          }
        } else {
          if (isMounted) {
            setItems([]);
          }
        }
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, fetchOrderItems, searchParams]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, [items]);

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      alert("Blessings! Your sacred order has been submitted successfully for divine packing and dispatch.");
      setIsPlacingOrder(false);
    }, 1200);
  };

  // 1. Loading State with Spinner
  if (isLoading) {
    return (
      <div className="w-full lg:w-5/12 rounded border border-[#fff0ad] bg-[#fff0ad] p-8 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-white border-t-[#d20b4f] mb-3" />
        <p className="text-xs font-bold text-[#d20b4f]">
          Loading your sacred order summary...
        </p>
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
          <div key={i} className="flex items-center justify-between pt-2">
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
                </h6>
                <span className="text-[10px] text-gray-700 font-semibold">
                  Qty: {item.qty} &bull; ₹{item.price.toFixed(2)} each
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#d20b4f] whitespace-nowrap ml-2">
              ₹{item.total.toFixed(2)}
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
