"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, ProductItem } from "@/app/services/productService";
import { getCategories, CategoryItem } from "@/app/services/categoryService";

interface DetailSidebarProps {
  currentProductId?: number | string;
}

export default function DetailSidebar({ currentProductId = 1 }: DetailSidebarProps) {
  const [featured, setFeatured] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});

  const numericCurrentId = typeof currentProductId === "string" ? parseInt(currentProductId, 10) : currentProductId;

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts({ limit: 20 }),
          getCategories({ limit: 20 }),
        ]);

        if (isMounted) {
          const prods = prodRes.products || [];
          const cats = catRes.categories || [];
          setFeatured(prods.filter((p) => p.id !== numericCurrentId).slice(0, 3));
          setCategories(cats);

          // Calculate product count per category
          const counts: { [key: string]: number } = {};
          cats.forEach((c) => {
            counts[c.name || ""] = prods.filter(
              (p) => p.category_id === c.id || (p.category && p.category.toLowerCase() === (c.name || "").toLowerCase())
            ).length;
          });
          setProductCounts(counts);
        }
      } catch (err) {
        console.error("Error loading detail sidebar data:", err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [numericCurrentId]);

  return (
    <div className="w-full lg:w-1/4">
      <div className="space-y-4">
        {/* Categories */}
        <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-4 shadow-2xs">
          <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 p-0 list-none mb-0">
            {categories.map((cat) => {
              const count = cat.name ? productCounts[cat.name] ?? 0 : 0;
              return (
                <li key={cat.id || cat.slug || cat.name}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat.name || "")}`}
                    className="flex items-center justify-between text-xs font-bold text-black hover:text-[#d20b4f] transition no-underline"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-black">({count})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Featured Items */}
        {featured.length > 0 && (
          <div className="rounded border border-[#fff0ad] bg-white p-4 shadow-2xs">
            <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
              Featured Seva Items
            </h4>
            <div className="space-y-3">
              {featured.map((p) => {
                const formattedPrice = typeof p.price === "number" ? `₹${p.price.toFixed(2)}` : p.price;
                return (
                  <Link
                    key={p.id}
                    href={`/shop-detail?id=${p.id}&size=Size%202`}
                    className="flex items-center gap-2.5 rounded border border-[#fff0ad] p-2 hover:bg-[#fff0ad]/20 transition no-underline block"
                  >
                    <div className="h-12 w-12 flex-shrink-0 bg-[#fff0ad] p-1 flex items-center justify-center rounded overflow-hidden">
                      <img
                        src={p.img || p.image_url || "/assets/best-selling.png"}
                        className="h-full w-full object-contain transition-transform hover:scale-105"
                        alt={p.name}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h6 className="heading-font text-xs font-bold text-black truncate mb-0.5" title={p.name}>
                        {p.name}
                      </h6>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#d20b4f]">{formattedPrice}</span>
                        {p.oldPrice && (
                          <span className="text-[10px] text-gray-500 line-through">{p.oldPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
