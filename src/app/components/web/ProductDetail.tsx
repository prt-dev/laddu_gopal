"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProductById, ProductItem } from "@/app/services/productService";
import AddToCartButton from "@/app/components/web/AddToCartButton";
import Spinner from "@/app/components/web/Spinner";
import Loading from "@/app/components/common/Loading";

interface ProductDetailProps {
  productId?: number | string;
  initialSize?: string;
}

export default function ProductDetail({ productId, initialSize }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize || "Size 0");

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!productId) return;
      try {
        setIsLoading(true);
        const data = await getProductById(productId);
        if (isMounted) {
          setProduct(data);
          const sizes = data.sizes || ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"];
          if (initialSize && sizes.includes(initialSize)) {
            setSelectedSize(initialSize);
          } else {
            setSelectedSize(sizes[0] || "Size 0");
          }
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [productId, initialSize]);

  if (isLoading || !product) {
    return (
      <div className="w-full lg:w-3/4 flex justify-center items-center py-16 bg-white rounded border border-[#fff0ad]">
        <Loading
          variant="container"
          size="md"
          message="Loading sacred item details..."
        />
      </div>
    );
  }

  const sizes = product.sizes || ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"];
  const formattedPrice = typeof product.price === "number" ? `₹${product.price.toFixed(2)}` : product.price;

  return (
    <div className="w-full lg:w-3/4">
      <div className="rounded border border-[#fff0ad] bg-white p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="flex items-center justify-center rounded bg-[#fff0ad]/40 p-6 border border-[#fff0ad] relative overflow-hidden">
            <img
              src={product.img || product.image_url || "/assets/best-selling.png"}
              alt={product.name}
              className="max-h-72 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            {product.category && (
              <span className="absolute top-3 left-3 rounded bg-[#d20b4f] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                {product.category}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-[#fff0ad] px-2.5 py-0.5 text-[11px] font-bold text-[#d20b4f]">
                  In Stock &bull; SKU: {product.sku || "N/A"}
                </span>
              </div>

              <h1 className="heading-font text-xl sm:text-2xl font-bold text-[#d20b4f] mt-2 mb-2">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#d20b4f]">{formattedPrice}</span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.oldPrice}
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-[1.6] text-black">
                {product.desc || product.description}
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
                  {sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    const sizeNumber = size.replace("Size ", "No. ");
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${isSelected
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
            <div className="mt-6 pt-4 border-t border-[#fff0ad] flex flex-wrap items-center gap-3">
              <AddToCartButton
                productId={product.id || 1}
                variant={selectedSize}
                price={product.price || 0}
                quantity={1}
                product={product as any}
                className="px-6 py-2.5 text-sm"
                showIcon={true}
                loadingText="Adding to Basket..."
                successText="Added to Devotional Basket!"
              />

              <Link
                href="/cart"
                className="rounded border border-[#d20b4f] px-5 py-2.5 text-sm font-bold text-[#d20b4f] hover:bg-[#fff0ad]/50 transition no-underline text-center inline-flex items-center gap-1.5"
              >
                View Basket
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
