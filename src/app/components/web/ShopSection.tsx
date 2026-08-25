"use client";

import { useState, useMemo } from "react";
import ShopSidebar from "./ShopSidebar";
import ShopProducts, { defaultProducts } from "./ShopProducts";
import { CategoryItem } from "./ShopSidebarCategories";

export default function ShopSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  // Extract unique category tags dynamically from products
  const uniqueCategories: CategoryItem[] = useMemo(() => {
    const rawCategories = Array.from(
      new Set(defaultProducts.map((p) => p.category))
    );
    return [
      { label: "All Items", count: defaultProducts.length, value: "" },
      ...rawCategories.map((cat) => ({
        label: cat,
        value: cat,
        count: defaultProducts.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase()
        ).length,
      })),
    ];
  }, []);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory((prev) =>
      prev.toLowerCase() === category.toLowerCase() ? "" : category
    );
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize((prev) => (prev === size ? "" : size));
  };

  const handleClearAllFilters = () => {
    setSelectedCategory("");
    setSelectedSize("");
    setSearchQuery("");
    setSortBy("");
  };

  const hasActiveFilters = Boolean(selectedCategory || selectedSize || searchQuery);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-[#fff0ad] p-4 rounded shadow-xs">
        <div className="w-full sm:w-72">
          <div className="relative">
            <input
              type="search"
              placeholder="Search poshak, pagdi, shringar..."
              className="w-full rounded border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute right-2.5 top-2 text-[#d20b4f] text-xs">
              <i className="fa fa-search" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end text-xs font-bold text-black">
          <label htmlFor="shop-sort">Sort by:</label>
          <select
            id="shop-sort"
            className="rounded border border-gray-300 bg-white py-1 px-2 text-xs font-bold text-black focus:border-[#d20b4f] focus:outline-hidden cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Featured Items</option>
            <option value="bestseller">Top Selling</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Badges Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded border border-[#fff0ad] shadow-2xs">
          <span className="text-xs font-bold text-gray-700">Active Filters:</span>

          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className="inline-flex items-center gap-1 rounded bg-[#d20b4f] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#b80943] cursor-pointer border-0 shadow-2xs"
            >
              <span>Category: {selectedCategory}</span>
              <span className="font-bold">&times;</span>
            </button>
          )}

          {selectedSize && (
            <button
              type="button"
              onClick={() => setSelectedSize("")}
              className="inline-flex items-center gap-1 rounded bg-[#d20b4f] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#b80943] cursor-pointer border-0 shadow-2xs"
            >
              <span>Size: {selectedSize}</span>
              <span className="font-bold">&times;</span>
            </button>
          )}

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1 rounded bg-[#d20b4f] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#b80943] cursor-pointer border-0 shadow-2xs"
            >
              <span>Search: &ldquo;{searchQuery}&rdquo;</span>
              <span className="font-bold">&times;</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleClearAllFilters}
            className="text-[11px] font-bold text-[#d20b4f] hover:underline bg-transparent border-0 cursor-pointer ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        <ShopProducts
          filterCategory={selectedCategory}
          filterSize={selectedSize}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onSelectCategory={handleSelectCategory}
          onClearFilters={handleClearAllFilters}
        />
        <ShopSidebar
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          selectedSize={selectedSize}
          onSelectSize={handleSelectSize}
        />
      </div>
    </div>
  );
}


