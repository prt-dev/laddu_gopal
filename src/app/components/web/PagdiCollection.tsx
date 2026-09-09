"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useGeneral } from "@/app/context/GeneralContext";
import Loading from "@/app/components/common/Loading";

export default function PagdiCollection() {
  const { pagdiProducts, isLoadingProducts: isLoading } = useGeneral();

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
        <div className="py-8 flex justify-center items-center">
          <Loading
            variant="container"
            size="md"
            message="Loading Sacred Pagdi Collection..."
          />
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
