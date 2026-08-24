import Link from "next/link";

export default function KundanCollection() {
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-8">
      <h2 className="heading-font text-xl font-bold">
        Our Kundan Collection
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Link href="/shop" className="block">
          <img
            src="/assets/kundan.png"
            alt="Kundan Collection"
            className="mx-auto h-[150px] w-full object-contain sm:h-[190px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop" className="block">
          <img
            src="/assets/kundan.png"
            alt="Kundan Collection"
            className="mx-auto h-[150px] w-full object-contain sm:h-[190px] transition hover:scale-105"
          />
        </Link>

        <Link href="/shop" className="block">
          <img
            src="/assets/kundan.png"
            alt="Kundan Collection"
            className="mx-auto h-[150px] w-full object-contain sm:h-[190px] transition hover:scale-105"
          />
        </Link>
      </div>
    </section>
  );
}
