import Link from "next/link";

const products = [
  {
    img: "/assets/best-selling.png",
    category: "Poshak",
    name: "Handmade Velvet Poshak Set",
    price: "₹349.00",
    desc: "Exquisite velvet dress embroidered with golden zari and pearls.",
  },
  {
    img: "/assets/pagdi.png",
    category: "Pagdi",
    name: "Royal Zardozi Designer Pagdi",
    price: "₹180.00",
    desc: "Handcrafted traditional crown turban adorned with peacock feather motif.",
  },
  {
    img: "/assets/kundan.png",
    category: "Kundan Shringar",
    name: "Pure Kundan Haar & Tilak Set",
    price: "₹320.00",
    desc: "Gleaming gemstone necklace with matching tilak and bangles for Thakur Ji.",
  },
  {
    img: "/assets/best-selling.png",
    category: "Special",
    name: "Janmashtami Festive Poshak Combo",
    price: "₹599.00",
    desc: "Complete festive combo including matching pagdi, patka, and flute.",
  },
  {
    img: "/assets/pagdi.png",
    category: "Pagdi",
    name: "Pearl Embedded Mor Pagdi",
    price: "₹240.00",
    desc: "Elegantly shaped mor pagdi studded with micro pearls and golden work.",
  },
  {
    img: "/assets/kundan.png",
    category: "Kundan Shringar",
    name: "Meenakari Kundan Shringar Kit",
    price: "₹450.00",
    desc: "Hand-painted meenakari with kundan embellishments for divine beauty.",
  },
];

export default function ShopProducts() {
  return (
    <div className="w-full lg:w-3/4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product, i) => (
          <div
            key={i}
            className="flex flex-col rounded border border-[#fff0ad] bg-white overflow-hidden"
          >
            <div className="relative h-44 w-full bg-[#fff0ad]/30 p-3 flex items-center justify-center overflow-hidden">
              <Link href="/shop-detail" className="h-full w-full flex items-center justify-center">
                <img
                  src={product.img}
                  className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                  alt={product.name}
                />
              </Link>
              <span className="absolute top-2 left-2 rounded bg-[#d20b4f] px-2 py-0.5 text-[10px] font-bold text-black pointer-events-none">
                {product.category}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <Link href="/shop-detail" className="no-underline text-black hover:text-[#d20b4f]">
                <h3 className="heading-font text-sm font-bold truncate mb-1" title={product.name}>
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-black line-clamp-2 mb-3 flex-1">
                {product.desc}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#fff0ad] mt-auto">
                <span className="text-sm font-bold text-[#d20b4f]">
                  {product.price}
                </span>
                <Link
                  href="/cart"
                  className="rounded bg-[#d20b4f] px-4 py-1.5 text-xs font-bold text-black transition hover:bg-[#b80943] no-underline"
                >
                  Add to Cart
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
