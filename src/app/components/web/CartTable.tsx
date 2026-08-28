"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import CartItemRow, { CartItemType } from "./CartItemRow";
import {
  getMyCartApi,
  updateCartItemApi,
  deleteCartItemApi,
  CartItem,
} from "@/app/services/cartService";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { getProductById, allProducts } from "@/app/data/products";

const fallbackCartItems: CartItemType[] = [
  {
    id: 1,
    img: "/assets/best-selling.png",
    name: "Handmade Velvet Poshak Set",
    size: "Size 4",
    price: 349,
    quantity: 1,
  },
  {
    id: 2,
    img: "/assets/pagdi.png",
    name: "Royal Zardozi Designer Pagdi",
    size: "Size 2",
    price: 180,
    quantity: 1,
  },
  {
    id: 3,
    img: "/assets/kundan.png",
    name: "Pure Kundan Haar & Tilak Set",
    size: "Size 0-2",
    price: 320,
    quantity: 1,
  },
];

export default function CartTable() {
  const { token, isAuthenticated } = useWebAuth();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CartItemType[]>(fallbackCartItems);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch cart items from API if authenticated
  const fetchCart = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await getMyCartApi(token);
      const cartList: CartItem[] = response.items || response.carts || (Array.isArray(response) ? response : []);

      if (cartList && cartList.length > 0) {
        const mappedItems: CartItemType[] = cartList.map((c: CartItem) => {
          const localProd = c.product_id ? getProductById(c.product_id) : null;
          return {
            id: Number(c.id || c.product_id || Math.random()),
            img: (c.product?.image_url as string) || localProd?.img || "/assets/best-selling.png",
            name: (c.product?.name as string) || localProd?.name || "Devotional Sacred Item",
            size: c.variant || "Standard Size", // variant is size of product
            price: Number(c.price) || (localProd ? parseFloat(localProd.price.replace(/[^0-9.]/g, "")) : 0),
            quantity: c.quantity || 1,
          };
        });
        setItems(mappedItems);
      }
    } catch (error) {
      console.warn("Could not fetch cart items from backend, using current session:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      // Check if URL has item query param to add
      const urlItemId = searchParams.get("item");
      const urlSize = searchParams.get("size");
      if (urlItemId) {
        const found = getProductById(Number(urlItemId));
        if (found) {
          const newItem: CartItemType = {
            id: found.id,
            img: found.img,
            name: found.name,
            size: urlSize || found.sizes[0] || "Size 0",
            price: parseFloat(found.price.replace(/[^0-9.]/g, "")) || 0,
            quantity: 1,
          };
          setItems((prev) => {
            const exists = prev.some((p) => p.id === newItem.id && p.size === newItem.size);
            if (exists) return prev;
            return [newItem, ...prev];
          });
        }
      }
    }
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

  return (
    <>
      <div className="overflow-x-auto rounded border border-[#fff0ad] bg-white shadow-xs">
        {isLoading && (
          <div className="p-4 text-center text-xs font-bold text-[#d20b4f]">
            <i className="fa fa-spinner fa-spin mr-2" />
            Loading your devotional basket...
          </div>
        )}
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
            {items.length > 0 ? (
              items.map((item) => (
                <CartItemRow
                  key={`${item.id}-${item.size || ""}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500 font-bold">
                  Your devotional basket is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Coupon Row */}
      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          className="rounded border border-gray-300 px-3 py-1.5 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden sm:w-60"
          placeholder="Coupon Code"
        />
        <button
          className="rounded bg-[#d20b4f] px-5 py-1.5 text-xs font-bold text-black transition hover:bg-[#b80943] border-0 cursor-pointer"
          type="button"
        >
          Apply Coupon
        </button>
      </div>
    </>
  );
}

