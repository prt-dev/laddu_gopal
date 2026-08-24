import Link from "next/link";

export default function TopSelling() {
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-6">
      <h2 className="heading-font text-xl font-bold">
        Our Top Selling Items
      </h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Link href="/shop-detail" className="block overflow-hidden rounded">
          <img
            src="/assets/best-selling.png"
            alt="Laddu Gopal"
            className="h-[165px] w-full rounded object-cover sm:h-[200px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop-detail" className="block overflow-hidden rounded">
          <img
            src="/assets/best-selling.png"
            alt="Laddu Gopal"
            className="h-[165px] w-full rounded object-cover sm:h-[200px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop-detail" className="block overflow-hidden rounded">
          <img
            src="/assets/best-selling.png"
            alt="Laddu Gopal"
            className="h-[165px] w-full rounded object-cover sm:h-[200px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop-detail" className="block overflow-hidden rounded">
          <img
            src="/assets/best-selling.png"
            alt="Laddu Gopal"
            className="h-[165px] w-full rounded object-cover sm:h-[200px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop-detail" className="block overflow-hidden rounded">
          <img
            src="/assets/best-selling.png"
            alt="Laddu Gopal"
            className="h-[165px] w-full rounded object-cover sm:h-[200px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop-detail" className="block overflow-hidden rounded">
          <img
            src="/assets/best-selling.png"
            alt="Laddu Gopal"
            className="h-[165px] w-full rounded object-cover sm:h-[200px] transition hover:scale-105"
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
