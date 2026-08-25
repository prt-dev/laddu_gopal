import Link from "next/link";
import { allProducts } from "@/app/data/products";

export default function TopSelling() {
  const topProducts = allProducts.slice(0, 6);

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-6">
      <h2 className="heading-font text-xl font-bold text-black mb-1">
        Our Top Selling Items
      </h2>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {topProducts.map((p) => (
          <Link
            key={p.id}
            href={`/shop-detail?id=${p.id}&size=Size%202`}
            className="group block overflow-hidden rounded border border-[#fff0ad] bg-[#fff0ad]/30 p-2 text-center no-underline text-black hover:border-[#d20b4f]/60 hover:shadow-xs transition"
          >
            <div className="h-[120px] w-full flex items-center justify-center overflow-hidden rounded bg-white p-1 mb-2">
              <img
                src={p.img}
                alt={p.name}
                className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
              />
            </div>
            <h6 className="heading-font text-xs font-bold truncate group-hover:text-[#d20b4f] mb-0.5" title={p.name}>
              {p.name}
            </h6>
            <span className="text-xs font-bold text-[#d20b4f] block">
              {p.price}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          href="/shop"
          className="rounded bg-[#d20b4f] px-6 py-2 text-sm font-bold text-black transition hover:bg-[#b80943] no-underline"
        >
          See More
        </Link>
      </div>
    </section>
  );
}
