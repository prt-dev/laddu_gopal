"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ShopSidebar from "./ShopSidebar";
import ShopProducts from "./ShopProducts";
import { CategoryItem } from "./ShopSidebarCategories";
import { getProducts, ProductItem } from "@/app/services/productService";
import { getCategories } from "@/app/services/categoryService";
import Spinner from "./Spinner";

export default function ShopSection() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSize = searchParams.get("size") || "";
  const initialQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>("");

  // Fetch products and categories dynamically from API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const [prodRes, catRes] = await Promise.all([
          getProducts({ limit: 50 }),
          getCategories({ limit: 50 }),
        ]);

        if (isMounted) {
          setProducts(prodRes.products || []);
          setCategoriesList(catRes.categories || []);
        }
      } catch (err) {
        console.error("Error loading products/categories:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state when URL params change (e.g. from navbar, footer, or explore buttons)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat !== null) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const size = searchParams.get("size");
    if (size !== null) {
      setSelectedSize(size);
    }
  }, [searchParams]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Extract dynamic category counts and list
  const uniqueCategories: CategoryItem[] = useMemo(() => {
    const totalCount = products.length;
    const catItems: CategoryItem[] = [
      { label: "All Items", count: totalCount, value: "" },
    ];

    if (categoriesList.length > 0) {
      categoriesList.forEach((c) => {
        const cName = c.name || "";
        const count = products.filter(
          (p) =>
            p.category_id === c.id ||
            (p.category && p.category.toLowerCase() === cName.toLowerCase())
        ).length;
        catItems.push({
          label: cName,
          value: cName,
          count,
        });
      });
    } else {
      const rawCategories = Array.from(new Set(products.map((p) => p.category || ""))).filter(Boolean);
      rawCategories.forEach((cat) => {
        catItems.push({
          label: cat,
          value: cat,
          count: products.filter((p) => (p.category || "").toLowerCase() === cat.toLowerCase()).length,
        });
      });
    }

    return catItems;
  }, [products, categoriesList]);

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
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <ShopProducts
            products={products}
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
      )}
    </div>
  );
}
