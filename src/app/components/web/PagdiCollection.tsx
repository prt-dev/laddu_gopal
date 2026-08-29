"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { getProducts, ProductItem } from "@/app/services/productService";

export default function PagdiCollection() {
  const [pagdiProducts, setPagdiProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPagdi() {
      try {
        const res = await getProducts({ limit: 50 });
        if (isMounted) {
          const filtered = res.products.filter(
            (p) =>
              (p.category || "").toLowerCase() === "pagdi" ||
              p.category_id === 1 ||
              p.category_id === 2 ||
              (p.name || "").toLowerCase().includes("pagdi")
          );
          setPagdiProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading pagdi collection:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadPagdi();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="categories" className="mx-auto max-w-[1100px] px-5 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-font text-xl font-bold text-black mb-0">
          Our Pagdi Collection
        </h2>
        <Link
          href="/shop?category=Pagdi"
          className="text-xs font-bold text-[#d20b4f] hover:underline no-underline"
        >
          View All Pagdi &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 rounded-lg border border-[#fff0ad] bg-[#fff0ad]/20 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
          {pagdiProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Link
          href="/shop?category=Pagdi"
          className="rounded bg-[#d20b4f] px-6 py-2 text-sm font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs"
        >
          Explore All Pagdi
        </Link>
      </div>
    </section>
  );
}
