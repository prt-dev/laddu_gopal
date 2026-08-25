import Link from "next/link";
import ProductCard from "./ProductCard";
import { allProducts } from "@/app/data/products";

export default function TopSelling() {
  const topProducts = allProducts.slice(0, 4);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
        {topProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

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
