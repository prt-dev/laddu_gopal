"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { useGeneral } from "@/app/context/GeneralContext";
import Loading from "@/app/components/common/Loading";

export default function TopSelling() {
  const { topSellingProducts: products, isLoadingProducts: isLoading } = useGeneral();

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-font text-xl font-bold text-black mb-0">
          Our Top Selling Items
        </h2>
        <Link
          href="/shop"
          className="text-xs font-bold text-[#d20b4f] hover:underline no-underline"
        >
          View All &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="py-8 flex justify-center items-center">
          <Loading
            variant="container"
            size="md"
            message="Loading Top Selling Items..."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Link
          href="/shop"
          className="rounded bg-[#d20b4f] px-6 py-2 text-sm font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs"
        >
          See More Products
        </Link>
      </div>
    </section>
  );
}
