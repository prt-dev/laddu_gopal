"use client";

import React from "react";
import { CartItem } from "@/app/services/cartService";

export type { CartItem as CartItemType };

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: number | string, delta: number, variant?: string) => void;
  onRemove: (id: number | string, variant?: string) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const itemId = item.id ?? item.product_id ?? 0;
  const itemImg = item.img || item.product?.img || item.product?.image_url || "/assets/best-selling.png";
  const itemName = item.name || item.product?.name || "Sacred Item";
  const itemPrice =
    typeof item.price === "number"
      ? item.price
      : parseFloat(String(item.price || "0").replace(/[^0-9.]/g, "")) || 0;
  const itemQty = Number(item.quantity) || 1;
  const itemSize = item.variant || item.size;

  return (
    <tr className="hover:bg-[#fff0ad]/20 transition">
      {/* Product Thumbnail */}
      <td className="py-3 px-4">
        <div className="h-14 w-14 rounded-md bg-[#fff0ad]/60 p-1 flex items-center justify-center border border-[#fff0ad] overflow-hidden shadow-2xs">
          <img
            src={itemImg}
            className="h-full w-full object-contain transition-transform hover:scale-105"
            alt={itemName}
          />
        </div>
      </td>

      {/* Product Name & Details */}
      <td className="py-3 px-4">
        <div className="font-bold text-black heading-font text-sm">
          {itemName}
        </div>
        {itemSize && (
          <span className="inline-block mt-0.5 rounded bg-[#fff0ad] px-2 py-0.5 text-[10px] font-bold text-[#d20b4f]">
            {itemSize}
          </span>
        )}
      </td>

      {/* Unit Price */}
      <td className="py-3 px-4 font-bold text-[#d20b4f] text-sm">
        ₹{itemPrice.toFixed(2)}
      </td>

      {/* Quantity Selector */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5 bg-[#fff0ad]/40 p-1 rounded border border-[#fff0ad] w-fit">
          <button
            onClick={() => onUpdateQuantity(itemId, -1, itemSize)}
            disabled={itemQty <= 1}
            className="h-6 w-6 rounded bg-white font-bold text-black hover:bg-[#d20b4f] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black transition flex items-center justify-center border border-gray-200 cursor-pointer text-xs disabled:cursor-not-allowed shadow-2xs"
            type="button"
            title="Decrease quantity"
          >
            -
          </button>
          <span className="w-7 text-center font-bold text-xs text-black">
            {itemQty}
          </span>
          <button
            onClick={() => onUpdateQuantity(itemId, 1, itemSize)}
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
        ₹{(itemPrice * itemQty).toFixed(2)}
      </td>

      {/* Remove Action */}
      <td className="py-3 px-4 text-center">
        <button
          onClick={() => onRemove(itemId, itemSize)}
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
