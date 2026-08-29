"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { ProductItem } from "@/app/services/productService";

export type { ProductItem };

interface ShopProductsProps {
  products?: ProductItem[];
  filterCategory?: string;
  filterSize?: string;
  searchQuery?: string;
  sortBy?: string;
  onSelectCategory?: (category: string) => void;
  onClearFilters?: () => void;
}

export default function ShopProducts({
  products = [],
  filterCategory,
  filterSize,
  searchQuery,
  sortBy,
  onSelectCategory,
  onClearFilters,
}: ShopProductsProps) {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});

  const handleSelectSize = (productId: number, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  // 1. Filter by category
  let filtered = filterCategory
    ? products.filter(
      (p) => (p.category || "").toLowerCase() === filterCategory.toLowerCase()
    )
    : products;

  // 2. Filter by size
  if (filterSize) {
    filtered = filtered.filter((p) => (p.sizes || []).includes(filterSize));
  }

  // 3. Filter by search query
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.desc || p.description || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q)
    );
  }

  // 4. Sort
  if (sortBy === "low-to-high") {
    filtered = [...filtered].sort((a, b) => {
      const pA = typeof a.price === "number" ? a.price : parseFloat(String(a.price || 0)) || 0;
      const pB = typeof b.price === "number" ? b.price : parseFloat(String(b.price || 0)) || 0;
      return pA - pB;
    });
  } else if (sortBy === "high-to-low") {
    filtered = [...filtered].sort((a, b) => {
      const pA = typeof a.price === "number" ? a.price : parseFloat(String(a.price || 0)) || 0;
      const pB = typeof b.price === "number" ? b.price : parseFloat(String(b.price || 0)) || 0;
      return pB - pA;
    });
  } else if (sortBy === "bestseller") {
    filtered = [...filtered].sort((a, b) => (b.category === "Special" ? 1 : -1));
  }

  return (
    <div className="w-full lg:w-3/4 order-1 lg:order-2">
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product as any}
              selectedSize={product.id ? selectedSizes[product.id] : undefined}
              onSelectSize={handleSelectSize}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 rounded-lg border border-[#fff0ad] bg-[#fff0ad]/20 text-center shadow-xs">
          <div className="h-16 w-16 rounded-full bg-[#fff0ad] flex items-center justify-center mb-3 text-[#d20b4f]">
            <i className="fa fa-search text-2xl" />
          </div>
          <h3 className="heading-font text-lg font-bold text-black mb-1">
            No items found matching your filters
          </h3>
          <p className="text-xs text-gray-600 mb-4 max-w-sm">
            Try adjusting your category or size filter to see more sacred Laddu Gopal poshak and accessories.
          </p>
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded bg-[#d20b4f] px-5 py-2 text-xs font-bold text-white hover:bg-[#b80943] transition cursor-pointer shadow-xs border-0"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
