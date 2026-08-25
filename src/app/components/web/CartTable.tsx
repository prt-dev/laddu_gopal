"use client";

import React, { useState } from "react";
import CartItemRow, { CartItemType } from "./CartItemRow";

const initialCartItems: CartItemType[] = [
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
  const [items, setItems] = useState<CartItemType[]>(initialCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

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
            {items.length > 0 ? (
              items.map((item) => (
                <CartItemRow
                  key={item.id}
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
