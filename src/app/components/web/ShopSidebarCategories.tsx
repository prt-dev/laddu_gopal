"use client";

import React from "react";

export interface CategoryItem {
  label: string;
  count: number;
  value?: string;
}

interface ShopSidebarCategoriesProps {
  categories?: CategoryItem[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const defaultCategories: CategoryItem[] = [
  { label: "All Items", count: 6, value: "" },
  { label: "Poshak", count: 2, value: "Poshak" },
  { label: "Pagdi", count: 2, value: "Pagdi" },
  { label: "Kundan Shringar", count: 2, value: "Kundan Shringar" },
  { label: "Special", count: 1, value: "Special" },
];

export default function ShopSidebarCategories({
  categories = defaultCategories,
  selectedCategory = "",
  onSelectCategory,
}: ShopSidebarCategoriesProps) {
  return (
    <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-3 border-b border-[#d20b4f]/20 pb-2">
        <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-0">
          Categories
        </h4>
        {selectedCategory && onSelectCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory("")}
            className="text-[11px] text-[#d20b4f] hover:underline font-bold bg-transparent border-0 cursor-pointer p-0"
          >
            Reset
          </button>
        )}
      </div>

      <ul className="space-y-1.5 p-0 list-none mb-0">
        {categories.map((cat) => {
          const catValue = cat.value !== undefined ? cat.value : cat.label;
          const isSelected =
            selectedCategory.toLowerCase() === catValue.toLowerCase() ||
            (catValue === "" && selectedCategory === "");

          return (
            <li key={cat.label}>
              <button
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(catValue)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-bold transition border-0 text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#d20b4f] text-white shadow-2xs"
                    : "bg-transparent text-black hover:bg-white/60 hover:text-[#d20b4f]"
                }`}
              >
                <span className="truncate">{cat.label}</span>
                <span
                  className={`text-[11px] ml-2 ${
                    isSelected ? "text-white/90" : "text-gray-700"
                  }`}
                >
                  ({cat.count})
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

