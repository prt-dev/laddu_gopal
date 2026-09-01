"use client";

import React from "react";

export interface CartItemType {
  id: number | string;
  product_id?: number | string;
  img: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  variant?: string;
}

interface CartItemRowProps {
  item: CartItemType;
  onUpdateQuantity: (id: number | string, delta: number, variant?: string) => void;
  onRemove: (id: number | string, variant?: string) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  return (
    <tr className="hover:bg-[#fff0ad]/20 transition">
      {/* Product Thumbnail */}
      <td className="py-3 px-4">
        <div className="h-14 w-14 rounded-md bg-[#fff0ad]/60 p-1 flex items-center justify-center border border-[#fff0ad] overflow-hidden shadow-2xs">
          <img
            src={item.img}
            className="h-full w-full object-contain transition-transform hover:scale-105"
            alt={item.name}
          />
        </div>
      </td>

      {/* Product Name & Details */}
      <td className="py-3 px-4">
        <div className="font-bold text-black heading-font text-sm">
          {item.name}
        </div>
        {item.size && (
          <span className="inline-block mt-0.5 rounded bg-[#fff0ad] px-2 py-0.5 text-[10px] font-bold text-[#d20b4f]">
            {item.size}
          </span>
        )}
      </td>

      {/* Unit Price */}
      <td className="py-3 px-4 font-bold text-[#d20b4f] text-sm">
        ₹{item.price.toFixed(2)}
      </td>

      {/* Quantity Selector */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5 bg-[#fff0ad]/40 p-1 rounded border border-[#fff0ad] w-fit">
          <button
            onClick={() => onUpdateQuantity(item.id, -1, item.variant || item.size)}
            disabled={item.quantity <= 1}
            className="h-6 w-6 rounded bg-white font-bold text-black hover:bg-[#d20b4f] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black transition flex items-center justify-center border border-gray-200 cursor-pointer text-xs disabled:cursor-not-allowed shadow-2xs"
            type="button"
            title="Decrease quantity"
          >
            -
          </button>
          <span className="w-7 text-center font-bold text-xs text-black">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1, item.variant || item.size)}
            className="h-6 w-6 rounded bg-white font-bold text-black hover:bg-[#d20b4f] hover:text-white transition flex items-center justify-center border border-gray-200 cursor-pointer text-xs shadow-2xs"
            type="button"
            title="Increase quantity"
          >
            +
          </button>
        </div>
      </td>

      {/* Subtotal */}
      <td className="py-3 px-4 font-bold text-black text-sm">
        ₹{(item.price * item.quantity).toFixed(2)}
      </td>

      {/* Remove Action */}
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onRemove(item.id, item.variant || item.size)}
          className="h-7 w-7 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition flex items-center justify-center mx-auto border-0 bg-transparent cursor-pointer"
          title="Remove item from cart"
          type="button"
        >
          <i className="fa fa-times text-xs" />
        </button>
      </td>
    </tr>
  );
}
