"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CartItemRow, { CartItemType } from "./CartItemRow";
import {
  getMyCartApi,
  updateCartItemApi,
  deleteCartItemApi,
  CartItem,
} from "@/app/services/cartService";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { getProductById } from "@/app/services/productService";

export default function CartTable() {
  const { token, isAuthenticated } = useWebAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch cart items from API if authenticated
  const fetchCart = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getMyCartApi(token);
      const cartList: CartItem[] = response.items || response.carts || (Array.isArray(response) ? response : []);

      if (cartList && cartList.length > 0) {
        const mappedItems: CartItemType[] = await Promise.all(
          cartList.map(async (c: CartItem) => {
            const localProd = c.product_id ? await getProductById(c.product_id) : null;
            const prodPrice = localProd
              ? typeof localProd.price === "number"
                ? localProd.price
                : parseFloat(String(localProd.price).replace(/[^0-9.]/g, "")) || 0
              : 0;
            return {
              id: Number(c.id || c.product_id || Math.random()),
              img: (c.product?.image_url as string) || localProd?.img || localProd?.image_url || "/assets/best-selling.png",
              name: (c.product?.name as string) || localProd?.name || "Devotional Sacred Item",
              size: c.variant || "Standard Size",
              price: Number(c.price) || prodPrice,
              quantity: c.quantity || 1,
            };
          })
        );
        setItems(mappedItems);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.warn("Could not fetch cart items from backend:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    async function initializeCart() {
      if (isAuthenticated && token) {
        await fetchCart();
      } else {
        // Check if URL has item query param to add for direct preview
        const urlItemId = searchParams.get("item");
        const urlSize = searchParams.get("size");
        if (urlItemId) {
          try {
            const found = await getProductById(Number(urlItemId));
            if (found && isMounted) {
              const foundPrice =
                typeof found.price === "number"
                  ? found.price
                  : parseFloat(String(found.price).replace(/[^0-9.]/g, "")) || 0;
              const defaultSize = (found.sizes && found.sizes[0]) || "Size 0";
              const newItem: CartItemType = {
                id: found.id || Number(urlItemId),
                img: found.img || found.image_url || "/assets/best-selling.png",
                name: found.name || "Sacred Item",
                size: urlSize || defaultSize,
                price: foundPrice,
                quantity: 1,
              };
              setItems([newItem]);
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

    initializeCart();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, fetchCart, searchParams]);

  const updateQuantity = async (id: number, delta: number) => {
    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;

    const newQty = Math.max(1, targetItem.quantity + delta);

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    if (token) {
      try {
        await updateCartItemApi(
          id,
          {
            quantity: newQty,
            variant: targetItem.size,
            price: targetItem.price,
          },
          token
        );
      } catch (err) {
        console.error("Failed to sync updated quantity with API:", err);
      }
    }
  };

  const removeItem = async (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (token) {
      try {
        await deleteCartItemApi(id, token);
      } catch (err) {
        console.error("Failed to delete cart item from API:", err);
      }
    }
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  // 1. Loading State with Spinner
  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center rounded-lg border border-[#fff0ad] bg-white shadow-xs">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#fff0ad] border-t-[#d20b4f] mb-3" />
        <p className="text-sm font-bold text-[#d20b4f]">
          Loading your devotional basket...
        </p>
      </div>
    );
  }

  // 2. Empty Basket / Not Found State
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-lg border border-[#fff0ad] bg-[#fff0ad]/20 text-center shadow-xs">
        <div className="h-20 w-20 rounded-full bg-[#fff0ad] flex items-center justify-center mb-4 text-[#d20b4f]">
          <i className="fa fa-shopping-basket text-3xl" />
        </div>
        <h3 className="heading-font text-xl sm:text-2xl font-bold text-black mb-2">
          Your Devotional Basket is Empty
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-md">
          You have not added any sacred poshak, pagdi, or shringar items to your basket yet.
        </p>
        <Link
          href="/shop"
          className="rounded bg-[#d20b4f] px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs"
        >
          Explore Divine Collection &rarr;
        </Link>
      </div>
    );
  }

  // 3. Cart Table Content
  return (
    <>
      <div className="overflow-x-auto rounded border border-[#fff0ad] bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#fff0ad] bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4 text-center">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#fff0ad] text-xs sm:text-sm text-black">
            {items.map((item) => (
              <CartItemRow
                key={`${item.id}-${item.size || ""}`}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Coupon & Summary Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Coupon Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden sm:w-60"
            placeholder="Coupon Code"
          />
          <button
            className="rounded bg-[#d20b4f] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#b80943] border-0 cursor-pointer shadow-xs"
            type="button"
          >
            Apply Coupon
          </button>
        </div>

        {/* Cart Total Summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-80 rounded border border-[#fff0ad] bg-[#fff0ad] p-5 shadow-xs">
            <h3 className="heading-font text-lg font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
              Cart Total
            </h3>

            <div className="space-y-2 text-xs sm:text-sm text-black font-bold">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="text-green-700">Free</span>
              </div>

              <div className="border-t border-[#d20b4f]/20 pt-2 flex justify-between items-center text-sm">
                <span className="text-black">Total:</span>
                <span className="text-[#d20b4f] text-base font-extrabold">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-4 block w-full rounded bg-[#d20b4f] py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
