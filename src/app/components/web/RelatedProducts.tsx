import Link from "next/link";

const relatedProducts = [
  { img: "/assets/best-selling.png", name: "Handmade Velvet Poshak Set", category: "Poshak", price: "₹349.00" },
  { img: "/assets/pagdi.png", name: "Royal Zardozi Designer Pagdi", category: "Pagdi", price: "₹180.00" },
  { img: "/assets/kundan.png", name: "Pure Kundan Haar & Tilak Set", category: "Kundan", price: "₹320.00" },
];

export default function RelatedProducts() {
  return (
    <div className="mt-12 border-t border-[#fff0ad] pt-8">
      <h2 className="heading-font text-xl font-bold text-[#d20b4f] mb-6">
        Related Shringar Items
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {relatedProducts.map((p, i) => (
          <div
            key={i}
            className="flex flex-col rounded border border-[#fff0ad] bg-white overflow-hidden"
          >
            <div className="relative h-40 w-full bg-[#fff0ad]/30 p-3 flex items-center justify-center">
              <img
                src={p.img}
                className="h-full w-full object-contain"
                alt={p.name}
              />
              <span className="absolute top-2 left-2 rounded bg-[#d20b4f] px-2 py-0.5 text-[10px] font-bold text-black">
                {p.category}
              </span>
            </div>

            <div className="p-3 flex flex-col flex-1">
              <h3 className="heading-font text-xs font-bold text-black truncate mb-1" title={p.name}>
                {p.name}
              </h3>
              <div className="flex items-center justify-between pt-2 border-t border-[#fff0ad] mt-auto">
                <span className="text-xs font-bold text-[#d20b4f]">{p.price}</span>
                <Link
                  href="/shop-detail"
                  className="rounded bg-[#d20b4f] px-3 py-1 text-[11px] font-bold text-black transition hover:bg-[#b80943] no-underline"
                >
                  View Item
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
