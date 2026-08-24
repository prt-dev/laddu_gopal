import Link from "next/link";

export default function PagdiCollection() {
  return (
    <section id="categories" className="mx-auto max-w-[1100px] px-5 py-8">
      <h2 className="heading-font text-xl font-bold">
        Our Pagdi Collection
      </h2>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Link href="/shop" className="block">
          <img
            src="/assets/pagdi.png"
            alt="Pagdi"
            className="mx-auto h-[140px] w-full object-contain sm:h-[180px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop" className="block">
          <img
            src="/assets/pagdi.png"
            alt="Pagdi"
            className="mx-auto h-[140px] w-full object-contain sm:h-[180px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop" className="block">
          <img
            src="/assets/pagdi.png"
            alt="Pagdi"
            className="mx-auto h-[140px] w-full object-contain sm:h-[180px] transition hover:scale-105"
          />
        </Link>
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
