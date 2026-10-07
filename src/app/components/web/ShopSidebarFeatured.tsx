"use client";

import React from "react";
import Link from "next/link";
import { useGeneral } from "@/context/web/GeneralContext";

export interface FeaturedProductItem {
  img: string;
  name: string;
  price: string;
  oldPrice?: string;
  href?: string;
}

interface ShopSidebarFeaturedProps {
  products?: FeaturedProductItem[];
}

const defaultFeaturedProducts: FeaturedProductItem[] = [
  { img: "/assets/pagdi.png", name: "Royal Zardozi Pagdi", price: "₹180", oldPrice: "₹250", href: "/shop-detail?id=2&size=Size%202" },
  { img: "/assets/kundan.png", name: "Pure Kundan Haar Set", price: "₹320", oldPrice: "₹450", href: "/shop-detail?id=3&size=Size%202" },
  { img: "/assets/best-selling.png", name: "Velvet Laddu Gopal Poshak", price: "₹349", oldPrice: "₹499", href: "/shop-detail?id=1&size=Size%202" },
];

export default function ShopSidebarFeatured({
  products: propProducts,
}: ShopSidebarFeaturedProps) {
  const { products: contextProducts } = useGeneral();

  // Use the first 3 products from GeneralContext, or fallback to prop/defaults
  const featuredItems: FeaturedProductItem[] =
    propProducts ||
    (contextProducts && contextProducts.length > 0
      ? contextProducts.slice(0, 3).map((p) => {
          const firstSize = p.sizes?.[0] || "Size 0";
          const basePrice =
            typeof p.price === "number"
              ? p.price
              : parseFloat(String(p.price || 0)) || 0;
          const oldPriceVal = (p as any).original_price || (p as any).oldPrice;

          return {
            img: p.img || p.image_url || "/assets/best-selling.png",
            name: p.name || "Sacred Item",
            price: `₹${basePrice}`,
            oldPrice: oldPriceVal ? `₹${oldPriceVal}` : undefined,
            href: `/shop-detail?id=${p.id || 1}&size=${encodeURIComponent(firstSize)}`,
          };
        })
      : defaultFeaturedProducts);

  return (
    <div className="rounded border border-[#fff0ad] bg-white p-4">
      <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
        Featured Shringar
      </h4>
      <div className="space-y-3">
        {featuredItems.map((p, i) => (
          <Link
            key={i}
            href={p.href || "/shop-detail"}
            className="flex items-center gap-2 rounded border border-[#fff0ad] p-2 no-underline text-black hover:border-[#d20b4f]/40 transition group"
          >
            <div className="h-12 w-12 flex-shrink-0 bg-[#fff0ad] p-1 flex items-center justify-center rounded overflow-hidden">
              <img
                src={p.img}
                className="h-full w-full object-contain transition-transform group-hover:scale-105"
                alt={p.name}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h6
                className="heading-font text-xs font-bold text-black truncate mb-0.5 group-hover:text-[#d20b4f]"
                title={p.name}
              >
                {p.name}
              </h6>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#d20b4f]">{p.price}</span>
                {p.oldPrice && (
                  <span className="text-[10px] text-gray-500 line-through">{p.oldPrice}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
