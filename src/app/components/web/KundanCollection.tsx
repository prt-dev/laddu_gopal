"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { getProducts, ProductItem } from "@/app/services/productService";

export default function KundanCollection() {
  const [kundanProducts, setKundanProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadKundan() {
      try {
        const res = await getProducts({ limit: 50 });
        if (isMounted) {
          const filtered = res.products.filter(
            (p) =>
              (p.category || "").toLowerCase().includes("kundan") ||
              p.category_id === 3 ||
              (p.name || "").toLowerCase().includes("kundan")
          );
          setKundanProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading kundan collection:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadKundan();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-font text-xl font-bold text-black mb-0">
          Our Kundan Collection
        </h2>
        <Link
          href="/shop?category=Kundan%20Shringar"
          className="text-xs font-bold text-[#d20b4f] hover:underline no-underline"
        >
          View All Kundan &rarr;
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
          {kundanProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Link
          href="/shop?category=Kundan%20Shringar"
          className="rounded bg-[#d20b4f] px-6 py-2 text-sm font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs"
        >
          Explore All Kundan Shringar
        </Link>
      </div>
    </section>
  );
}
