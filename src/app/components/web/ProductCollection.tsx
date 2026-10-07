"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useGeneral } from "@/context/web/GeneralContext";
import Loading from "@/components/common/Loading";
import { ProductItem } from "@/app/services/productService";

export type CollectionType = "top-selling" | "pagdi" | "kundan" | "custom";

export interface ProductCollectionProps {
  /** Pre-configured collection preset type */
  type?: CollectionType;
  /** Section heading title */
  title?: string;
  /** Category name or id to filter from all products */
  category?: string;
  /** Explicit custom product list */
  products?: ProductItem[];
  /** Unified URL for both the header "View All" link and bottom CTA button */
  href?: string;
  /** Text for the top-right header link */
  viewAllText?: string;
  /** Text for the bottom CTA button */
  buttonText?: string;
  /** Custom loading message */
  loadingMessage?: string;
  /** HTML section id attribute */
  id?: string;
  /** Max number of items to display (default: 4) */
  limit?: number;
  /** Additional custom class names for the section */
  className?: string;
}

const PRESETS: Record<
  string,
  {
    title: string;
    href: string;
    viewAllText: string;
    buttonText: string;
    loadingMessage: string;
    id?: string;
  }
> = {
  "top-selling": {
    title: "Our Top Selling Items",
    href: "/shop",
    viewAllText: "View All \u2192",
    buttonText: "See More Products",
    loadingMessage: "Loading Top Selling Items...",
  },
  pagdi: {
    title: "Our Pagdi Collection",
    href: "/shop?category=Pagdi",
    viewAllText: "View All Pagdi \u2192",
    buttonText: "Explore All Pagdi",
    loadingMessage: "Loading Sacred Pagdi Collection...",
    id: "categories",
  },
  kundan: {
    title: "Our Kundan Collection",
    href: "/shop?category=Kundan%20Shringar",
    viewAllText: "View All Kundan \u2192",
    buttonText: "Explore All Kundan Shringar",
    loadingMessage: "Loading Kundan Shringar Collection...",
  },
};

export default function ProductCollection({
  type = "custom",
  title,
  category,
  products: customProducts,
  href,
  viewAllText,
  buttonText,
  loadingMessage,
  id,
  limit = 4,
  className = "",
}: ProductCollectionProps) {
  const { getCollectionProducts, isLoadingProducts: isLoading } = useGeneral();

  const preset = PRESETS[type] || {};
  const targetCategory =
    category || (type !== "top-selling" && type !== "custom" ? type : undefined);

  // Single unified target link for header and bottom CTA
  const targetHref =
    href ||
    preset.href ||
    (targetCategory
      ? `/shop?category=${encodeURIComponent(targetCategory)}`
      : "/shop");

  const resolvedTitle =
    title ||
    preset.title ||
    (targetCategory ? `Our ${targetCategory} Collection` : "Our Collection");

  const resolvedViewAllText =
    viewAllText ||
    preset.viewAllText ||
    (targetCategory ? `View All ${targetCategory} \u2192` : "View All \u2192");

  const resolvedButtonText =
    buttonText ||
    preset.buttonText ||
    (targetCategory ? `Explore All ${targetCategory}` : "See More Products");

  const resolvedLoadingMessage =
    loadingMessage || preset.loadingMessage || "Loading Products...";

  const resolvedId = id || preset.id;

  // Resolve products dynamically using getCollectionProducts
  const displayedProducts =
    customProducts ||
    getCollectionProducts(targetCategory || type, limit);

  return (
    <section id={resolvedId} className={`mx-auto max-w-[1100px] px-5 py-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-font text-xl font-bold text-black mb-0">
          {resolvedTitle}
        </h2>
        {targetHref && (
          <Link
            href={targetHref}
            className="text-xs font-bold text-[#d20b4f] hover:underline no-underline"
          >
            {resolvedViewAllText}
          </Link>
        )}
      </div>

      {/* Product Grid or Loading State */}
      {isLoading ? (
        <div className="py-8 flex justify-center items-center">
          <Loading
            variant="container"
            size="md"
            message={resolvedLoadingMessage}
          />
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-sm">
          No products found in this collection.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}

      {/* Bottom Action CTA */}
      {targetHref && (
        <div className="mt-6 flex justify-center">
          <Link
            href={targetHref}
            className="rounded bg-[#d20b4f] px-6 py-2 text-sm font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs"
          >
            {resolvedButtonText}
          </Link>
        </div>
      )}
    </section>
  );
}
