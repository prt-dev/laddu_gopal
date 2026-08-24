import Link from "next/link";

const categories = [
  { label: "Pagdi & Turbans", count: 24 },
  { label: "Kundan Shringar", count: 18 },
  { label: "Handcrafted Poshak", count: 35 },
  { label: "Mukut & Crowns", count: 15 },
  { label: "Flutes & Mor Pankh", count: 12 },
];

const featuredProducts = [
  { img: "/assets/pagdi.png", name: "Royal Zardozi Pagdi", price: "₹180", oldPrice: "₹250" },
  { img: "/assets/kundan.png", name: "Pure Kundan Haar Set", price: "₹320", oldPrice: "₹450" },
  { img: "/assets/best-selling.png", name: "Velvet Laddu Gopal Poshak", price: "₹349", oldPrice: "₹499" },
];

export default function DetailSidebar() {
  return (
    <div className="w-full lg:w-1/4">
      <div className="space-y-4">
        {/* Categories */}
        <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-4">
          <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 p-0 list-none mb-0">
            {categories.map((cat) => (
              <li key={cat.label}>
                <Link
                  href="/shop"
                  className="flex items-center justify-between text-xs font-bold text-black hover:text-[#d20b4f] transition no-underline"
                >
                  <span>{cat.label}</span>
                  <span className="text-xs text-black">({cat.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Items */}
        <div className="rounded border border-[#fff0ad] bg-white p-4">
          <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
            Related Shringar
          </h4>
          <div className="space-y-3">
            {featuredProducts.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded border border-[#fff0ad] p-2"
              >
                <div className="h-12 w-12 flex-shrink-0 bg-[#fff0ad] p-1 flex items-center justify-center rounded">
                  <img
                    src={p.img}
                    className="h-full w-full object-contain"
                    alt={p.name}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h6 className="heading-font text-xs font-bold text-black truncate mb-0.5" title={p.name}>
                    {p.name}
                  </h6>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#d20b4f]">{p.price}</span>
                    <span className="text-[10px] text-gray-500 line-through">{p.oldPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
