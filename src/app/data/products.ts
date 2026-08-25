export interface ProductItem {
  id: number;
  img: string;
  category: string;
  name: string;
  price: string;
  oldPrice?: string;
  desc: string;
  sizes: string[];
  specs?: { label: string; value: string }[];
}

export const allProducts: ProductItem[] = [
  {
    id: 1,
    img: "/assets/best-selling.png",
    category: "Poshak",
    name: "Handmade Velvet Laddu Gopal Poshak Set",
    price: "₹349.00",
    oldPrice: "₹499.00",
    desc: "Exquisite handmade velvet poshak richly embroidered with shimmering zari threads, glass stones, and pearl borders. Designed with tender devotion for Thakur Ji's daily and festive shringar.",
    sizes: ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"],
    specs: [
      { label: "Fabric & Material", value: "Premium Pure Velvet with Heavy Zari Embroidery & Pearls" },
      { label: "Compatible Deity Sizes", value: "Available in Sizes 0, 1, 2, 3, 4, 5, 6" },
      { label: "Package Inclusions", value: "1 Poshak, 1 Matching Pagdi / Mukut, 1 Patka, 1 Kundan Mala" },
      { label: "Craftsmanship", value: "100% Handcrafted by traditional Karigars" },
      { label: "Care Instructions", value: "Gentle dry wipe with soft cloth" },
    ],
  },
  {
    id: 2,
    img: "/assets/pagdi.png",
    category: "Pagdi",
    name: "Royal Zardozi Designer Pagdi",
    price: "₹180.00",
    oldPrice: "₹250.00",
    desc: "Handcrafted traditional crown turban adorned with peacock feather motif and shimmering golden zardozi work for royal Thakur Ji shringar.",
    sizes: ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5"],
    specs: [
      { label: "Material", value: "High Quality Silk Base with Pure Zardozi & Kundan Work" },
      { label: "Compatible Deity Sizes", value: "Sizes 0, 1, 2, 3, 4, 5" },
      { label: "Package Inclusions", value: "1 Royal Designer Pagdi with attached Mor Pankh" },
      { label: "Craftsmanship", value: "Artisan Hand-stitched & Embellished" },
      { label: "Care Instructions", value: "Store in a dry moisture-free box" },
    ],
  },
  {
    id: 3,
    img: "/assets/kundan.png",
    category: "Kundan Shringar",
    name: "Pure Kundan Haar & Tilak Set",
    price: "₹320.00",
    oldPrice: "₹450.00",
    desc: "Gleaming gemstone necklace with matching tilak and delicate bangles crafted specifically for Thakur Ji's divine grace.",
    sizes: ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"],
    specs: [
      { label: "Material", value: "Gold-plated Brass with Authentic Polki Kundan Stones" },
      { label: "Compatible Deity Sizes", value: "Sizes 0, 1, 2, 3, 4, 5, 6" },
      { label: "Package Inclusions", value: "1 Kundan Mala, 1 Forehead Tilak, 1 Pair Bangles, 1 Flute" },
      { label: "Craftsmanship", value: "Handcrafted Meenakari Enameling" },
      { label: "Care Instructions", value: "Wipe gently with a soft dry cloth" },
    ],
  },
  {
    id: 4,
    img: "/assets/best-selling.png",
    category: "Special",
    name: "Janmashtami Festive Poshak Combo",
    price: "₹599.00",
    oldPrice: "₹799.00",
    desc: "Complete festive combo including heavy embroidered velvet poshak, matching pagdi, patka, and golden flute for auspicious celebrations.",
    sizes: ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"],
    specs: [
      { label: "Fabric & Material", value: "Velvet & Brocade with Zari & Stone Works" },
      { label: "Compatible Deity Sizes", value: "Sizes 0, 1, 2, 3, 4, 5, 6" },
      { label: "Package Inclusions", value: "1 Heavy Festive Poshak, 1 Designer Pagdi, 1 Patka, 1 Brass Flute" },
      { label: "Craftsmanship", value: "Vrindavan Artisan Handiwork" },
      { label: "Care Instructions", value: "Dry wipe only, do not wash with water" },
    ],
  },
  {
    id: 5,
    img: "/assets/pagdi.png",
    category: "Pagdi",
    name: "Pearl Embedded Mor Pagdi",
    price: "₹240.00",
    oldPrice: "₹320.00",
    desc: "Elegantly shaped mor pagdi studded with micro pearls, golden work, and real miniature peacock feather accent.",
    sizes: ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5"],
    specs: [
      { label: "Material", value: "Silk, Pearl beads, and Mor Pankh" },
      { label: "Compatible Deity Sizes", value: "Sizes 0, 1, 2, 3, 4, 5" },
      { label: "Package Inclusions", value: "1 Pearl Embedded Mor Pagdi" },
      { label: "Craftsmanship", value: "Handcrafted Traditional Art" },
      { label: "Care Instructions", value: "Keep away from moisture and direct water" },
    ],
  },
  {
    id: 6,
    img: "/assets/kundan.png",
    category: "Kundan Shringar",
    name: "Meenakari Kundan Shringar Kit",
    price: "₹450.00",
    oldPrice: "₹599.00",
    desc: "Hand-painted meenakari with kundan embellishments for divine beauty, complete with earrings, haar, and waist belt.",
    sizes: ["Size 0", "Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6"],
    specs: [
      { label: "Material", value: "Enamelled Meenakari on Brass & Cubic Zirconia" },
      { label: "Compatible Deity Sizes", value: "Sizes 0, 1, 2, 3, 4, 5, 6" },
      { label: "Package Inclusions", value: "1 Long Haar, 1 Choker, 1 Kamarbandh, 1 Pair Kundal, 1 Tilak" },
      { label: "Craftsmanship", value: "Traditional Jaipur Meenakari" },
      { label: "Care Instructions", value: "Store in soft cotton pouch" },
    ],
  },
];

export function getProductById(id: number | string | null | undefined): ProductItem {
  if (!id) return allProducts[0];
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  const found = allProducts.find((p) => p.id === numId);
  return found || allProducts[0];
}

export function getRelatedProducts(currentId: number, limit = 3): ProductItem[] {
  return allProducts.filter((p) => p.id !== currentId).slice(0, limit);
}
