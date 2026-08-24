import Link from "next/link";

const specs = [
  { label: "Fabric & Material", value: "Premium Pure Velvet with Heavy Zari Embroidery & Pearls" },
  { label: "Compatible Deity Sizes", value: "Available in Sizes 0, 1, 2, 3, 4, 5, 6" },
  { label: "Package Inclusions", value: "1 Poshak, 1 Matching Pagdi / Mukut, 1 Patka, 1 Kundan Mala" },
  { label: "Craftsmanship", value: "100% Handcrafted by traditional Karigars" },
  { label: "Care Instructions", value: "Gentle dry wipe with soft cloth" },
];

export default function ProductDetail() {
  return (
    <div className="w-full lg:w-3/4">
      <div className="rounded border border-[#fff0ad] bg-white p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="flex items-center justify-center rounded bg-[#fff0ad] p-4">
            <img
              src="/assets/best-selling.png"
              alt="Handmade Velvet Poshak Set"
              className="max-h-72 w-auto object-contain"
            />
          </div>

          {/* Info */}
          <div>
            <h1 className="heading-font text-xl sm:text-2xl font-bold text-[#d20b4f]">
              Handmade Velvet Laddu Gopal Poshak Set
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#d20b4f]">₹349.00</span>
              <span className="text-sm text-gray-500 line-through">₹499.00</span>
            </div>

            <p className="mt-4 text-sm leading-[1.5] text-black">
              Exquisite handmade velvet poshak richly embroidered with shimmering zari threads, glass stones, and pearl borders. Designed with tender devotion for Thakur Ji&apos;s daily and festive shringar.
            </p>

            {/* Size Selector */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-black mb-2">
                Select Deity Size:
              </label>
              <div className="flex flex-wrap gap-2">
                {["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"].map(
                  (size, idx) => (
                    <button
                      key={size}
                      type="button"
                      className={`rounded px-3 py-1 text-xs font-bold transition cursor-pointer border ${
                        idx === 4
                          ? "bg-[#d20b4f] text-black border-[#d20b4f]"
                          : "bg-[#fff0ad] text-black border-[#fff0ad] hover:bg-[#d20b4f]"
                      }`}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Link
                href="/cart"
                className="rounded bg-[#d20b4f] px-6 py-2 text-sm font-bold text-black transition hover:bg-[#b80943] no-underline text-center inline-block"
              >
                Add to Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-8 border-t border-[#fff0ad] pt-6">
          <h3 className="heading-font text-lg font-bold text-[#d20b4f] mb-3">
            Specifications :
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {specs.map((s, idx) => (
              <div key={idx} className="rounded bg-[#fff0ad] p-3 text-black">
                <span className="text-xs font-bold text-[#d20b4f] block mb-0.5">
                  {s.label}
                </span>
                <span className="text-xs font-bold text-black">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
