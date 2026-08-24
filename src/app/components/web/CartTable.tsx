"use client";

import React, { useState } from "react";

const initialCartItems = [
  {
    id: 1,
    img: "/assets/best-selling.png",
    name: "Handmade Velvet Poshak Set (Size 4)",
    price: 349,
    quantity: 1,
  },
  {
    id: 2,
    img: "/assets/pagdi.png",
    name: "Royal Zardozi Designer Pagdi",
    price: 180,
    quantity: 1,
  },
  {
    id: 3,
    img: "/assets/kundan.png",
    name: "Pure Kundan Haar & Tilak Set",
    price: 320,
    quantity: 1,
  },
];

export default function CartTable() {
  const [items, setItems] = useState(initialCartItems);

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
      <div className="overflow-x-auto rounded border border-[#fff0ad] bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#fff0ad] bg-[#fff0ad] text-xs font-bold text-[#d20b4f]">
              <th className="py-2.5 px-4">Item</th>
              <th className="py-2.5 px-4">Name</th>
              <th className="py-2.5 px-4">Price</th>
              <th className="py-2.5 px-4">Quantity</th>
              <th className="py-2.5 px-4">Total</th>
              <th className="py-2.5 px-4 text-center">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#fff0ad] text-xs sm:text-sm text-black">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#fff0ad]/20 transition">
                <td className="py-2.5 px-4">
                  <div className="h-14 w-14 rounded bg-[#fff0ad] p-1 flex items-center justify-center">
                    <img
                      src={item.img}
                      className="h-full w-full object-contain"
                      alt={item.name}
                    />
                  </div>
                </td>
                <td className="py-2.5 px-4 font-bold text-black heading-font">
                  {item.name}
                </td>
                <td className="py-2.5 px-4 font-bold text-[#d20b4f]">
                  ₹{item.price}
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="h-6 w-6 rounded bg-[#fff0ad] font-bold text-black hover:bg-[#d20b4f] transition flex items-center justify-center border-0 cursor-pointer text-xs"
                      type="button"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="h-6 w-6 rounded bg-[#fff0ad] font-bold text-black hover:bg-[#d20b4f] transition flex items-center justify-center border-0 cursor-pointer text-xs"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-2.5 px-4 font-bold text-black">
                  ₹{item.price * item.quantity}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="h-6 w-6 rounded text-red-600 hover:bg-red-50 transition border-0 bg-transparent cursor-pointer"
                    title="Remove item"
                    type="button"
                  >
                    <i className="fa fa-times" />
                  </button>
                </td>
              </tr>
            ))}
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
