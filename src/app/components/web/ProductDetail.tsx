"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProductById, ProductItem } from "@/app/data/products";

interface ProductDetailProps {
  productId?: number | string;
  initialSize?: string;
}

export default function ProductDetail({ productId, initialSize }: ProductDetailProps) {
  const product: ProductItem = getProductById(productId);

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (initialSize && product.sizes.includes(initialSize)) {
      return initialSize;
    }
    return product.sizes[0] || "Size 0";
  });

  useEffect(() => {
    if (initialSize && product.sizes.includes(initialSize)) {
      setSelectedSize(initialSize);
    } else {
      setSelectedSize(product.sizes[0] || "Size 0");
    }
  }, [product.id, initialSize]);

  return (
    <div className="w-full lg:w-3/4">
      <div className="rounded border border-[#fff0ad] bg-white p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="flex items-center justify-center rounded bg-[#fff0ad]/40 p-6 border border-[#fff0ad] relative overflow-hidden">
            <img
              src={product.img}
              alt={product.name}
              className="max-h-72 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute top-3 left-3 rounded bg-[#d20b4f] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
              {product.category}
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-[#fff0ad] px-2.5 py-0.5 text-[11px] font-bold text-[#d20b4f]">
                  In Stock &bull; Sacred Seva Delivery
                </span>
              </div>

              <h1 className="heading-font text-xl sm:text-2xl font-bold text-[#d20b4f] mt-2 mb-2">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#d20b4f]">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.oldPrice}
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-[1.6] text-black">
                {product.desc}
              </p>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-black">
                    Select Deity Size:
                  </label>
                  <span className="text-xs font-bold text-[#d20b4f]">
                    Selected: {selectedSize}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const sizeNumber = size.replace("Size ", "No. ");
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                          isSelected
                            ? "bg-[#d20b4f] text-white border-[#d20b4f] shadow-xs scale-105"
                            : "bg-[#fff0ad]/60 text-black border-[#fff0ad] hover:bg-[#d20b4f] hover:text-white"
                        }`}
                      >
                        {size} ({sizeNumber})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-[#fff0ad]">
              <Link
                href={`/cart?item=${product.id}&size=${encodeURIComponent(selectedSize)}`}
                className="rounded bg-[#d20b4f] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#b80943] no-underline text-center inline-block shadow-xs cursor-pointer"
              >
                Add to Cart ({selectedSize})
              </Link>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specs && product.specs.length > 0 && (
          <div className="mt-8 border-t border-[#fff0ad] pt-6">
            <h3 className="heading-font text-lg font-bold text-[#d20b4f] mb-3">
              Specifications &amp; Seva Details:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.specs.map((s, idx) => (
                <div key={idx} className="rounded bg-[#fff0ad]/50 border border-[#fff0ad] p-3 text-black">
                  <span className="text-xs font-bold text-[#d20b4f] block mb-0.5">
                    {s.label}
                  </span>
                  <span className="text-xs font-bold text-black">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
