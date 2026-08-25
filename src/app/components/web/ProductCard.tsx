"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductItem } from "@/app/data/products";

export type { ProductItem };

interface ProductCardProps {
  product: ProductItem;
  selectedSize?: string;
  onSelectSize?: (productId: number, size: string) => void;
  onSelectCategory?: (category: string) => void;
}

export default function ProductCard({
  product,
  selectedSize: controlledSize,
  onSelectSize,
  onSelectCategory,
}: ProductCardProps) {
  const [internalSize, setInternalSize] = useState<string>(
    controlledSize || product.sizes[0] || "Size 0"
  );

  const activeSize = controlledSize !== undefined ? controlledSize : internalSize;

  const handleSizeClick = (size: string) => {
    setInternalSize(size);
    if (onSelectSize) {
      onSelectSize(product.id, size);
    }
  };

  const detailUrl = `/shop-detail?id=${product.id}&size=${encodeURIComponent(activeSize)}`;

  return (
    <div className="flex flex-col rounded-lg border border-[#fff0ad] bg-white overflow-hidden shadow-xs hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-44 w-full bg-[#fff0ad]/30 p-3 flex items-center justify-center overflow-hidden">
        <Link
          href={detailUrl}
          className="h-full w-full flex items-center justify-center"
        >
          <img
            src={product.img}
            className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
            alt={product.name}
          />
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onSelectCategory) {
              onSelectCategory(product.category);
            }
          }}
          className={`absolute top-2.5 left-2.5 rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-xs border-0 transition ${
            onSelectCategory
              ? "bg-[#d20b4f] hover:bg-[#b80943] cursor-pointer hover:scale-105"
              : "bg-[#d20b4f] pointer-events-none"
          }`}
          title={onSelectCategory ? `Filter by ${product.category}` : undefined}
        >
          {product.category}
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <Link
          href={detailUrl}
          className="no-underline text-black hover:text-[#d20b4f]"
        >
          <h3
            className="heading-font text-sm font-bold truncate mb-1"
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>

        {product.desc && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2.5">
            {product.desc}
          </p>
        )}

        {/* Available Sizes to Click */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3 pt-2 border-t border-[#fff0ad]/70">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold text-gray-700">Available Sizes:</span>
              <span className="text-[11px] font-bold text-[#d20b4f]">
                {activeSize}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => {
                const isSelected = activeSize === size;
                const sizeNumber = size.replace("Size ", "No. ");
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeClick(size)}
                    className={`rounded px-2 py-0.5 text-[11px] font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#d20b4f] text-white border-[#d20b4f] shadow-xs scale-105"
                        : "bg-[#fff0ad]/60 text-gray-800 border-[#fff0ad] hover:bg-[#fff0ad] hover:border-[#d20b4f]/40"
                    }`}
                    title={`Select ${size}`}
                  >
                    {sizeNumber}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-[#fff0ad] mt-auto">
          <span className="text-sm font-bold text-[#d20b4f]">
            {product.price}
          </span>
          <Link
            href={`/cart?item=${product.id}&size=${encodeURIComponent(activeSize)}`}
            className="rounded bg-[#d20b4f] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs"
          >
            Add to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
