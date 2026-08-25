import Link from "next/link";
import { allProducts } from "@/app/data/products";

interface DetailSidebarProps {
  currentProductId?: number;
}

const categories = [
  { label: "Poshak & Dresses", count: 2, filter: "Poshak" },
  { label: "Pagdi & Turbans", count: 2, filter: "Pagdi" },
  { label: "Kundan Shringar", count: 2, filter: "Kundan Shringar" },
  { label: "Special Combos", count: 1, filter: "Special" },
];

export default function DetailSidebar({ currentProductId = 1 }: DetailSidebarProps) {
  const featured = allProducts.filter((p) => p.id !== currentProductId).slice(0, 3);

  return (
    <div className="w-full lg:w-1/4">
      <div className="space-y-4">
        {/* Categories */}
        <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-4 shadow-2xs">
          <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 p-0 list-none mb-0">
            {categories.map((cat) => (
              <li key={cat.label}>
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.filter)}`}
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
        <div className="rounded border border-[#fff0ad] bg-white p-4 shadow-2xs">
          <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
            Featured Seva Items
          </h4>
          <div className="space-y-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/shop-detail?id=${p.id}&size=Size%202`}
                className="flex items-center gap-2.5 rounded border border-[#fff0ad] p-2 hover:bg-[#fff0ad]/20 transition no-underline block"
              >
                <div className="h-12 w-12 flex-shrink-0 bg-[#fff0ad] p-1 flex items-center justify-center rounded overflow-hidden">
                  <img
                    src={p.img}
                    className="h-full w-full object-contain transition-transform hover:scale-105"
                    alt={p.name}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h6 className="heading-font text-xs font-bold text-black truncate mb-0.5" title={p.name}>
                    {p.name}
                  </h6>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#d20b4f]">{p.price}</span>
                    {p.oldPrice && (
                      <span className="text-[10px] text-gray-500 line-through">{p.oldPrice}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
