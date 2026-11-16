export interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock_quantity: number;
  category_id: number;
  image_url: string;
  status: number;

  // Optional frontend helper fields for UI compatibility
  img?: string;
  category?: string;
  desc?: string;
  oldPrice?: string;
  sizes?: string[];
  specs?: { label: string; value: string }[];
}

export const allProducts: ProductItem[] = [
  {
    id: 1,
    name: "Handmade Velvet Laddu Gopal Poshak Set",
    description: "Exquisite handmade velvet poshak richly embroidered with shimmering zari threads, glass stones, and pearl borders. Designed with tender devotion for Thakur Ji's daily and festive shringar.",
    price: 349.0,
    sku: "POSHAK-001",
    stock_quantity: 50,
    category_id: 1,
    image_url: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997509_6a92ad458d1b6.png",
    status: 1,
    img: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997509_6a92ad458d1b6.png",
    category: "Poshak",
    desc: "Exquisite handmade velvet poshak richly embroidered with shimmering zari threads, glass stones, and pearl borders. Designed with tender devotion for Thakur Ji's daily and festive shringar.",
    oldPrice: "₹499.00",
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
    name: "Royal Zardozi Designer Pagdi",
    description: "Handcrafted traditional crown turban adorned with peacock feather motif and shimmering golden zardozi work for royal Thakur Ji shringar.",
    price: 180.0,
    sku: "PAGDI-002",
    stock_quantity: 40,
    category_id: 2,
    image_url: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997512_6a92ad483580f.png",
    status: 1,
    img: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997512_6a92ad483580f.png",
    category: "Pagdi",
    desc: "Handcrafted traditional crown turban adorned with peacock feather motif and shimmering golden zardozi work for royal Thakur Ji shringar.",
    oldPrice: "₹250.00",
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
    name: "Pure Kundan Haar & Tilak Set",
    description: "Gleaming gemstone necklace with matching tilak and delicate bangles crafted specifically for Thakur Ji's divine grace.",
    price: 320.0,
    sku: "KUNDAN-003",
    stock_quantity: 30,
    category_id: 3,
    image_url: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997513_6a92ad495a41c.png",
    status: 1,
    img: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997513_6a92ad495a41c.png",
    category: "Kundan Shringar",
    desc: "Gleaming gemstone necklace with matching tilak and delicate bangles crafted specifically for Thakur Ji's divine grace.",
    oldPrice: "₹450.00",
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
    name: "Janmashtami Festive Poshak Combo",
    description: "Complete festive combo including heavy embroidered velvet poshak, matching pagdi, patka, and golden flute for auspicious celebrations.",
    price: 599.0,
    sku: "SPECIAL-004",
    stock_quantity: 25,
    category_id: 4,
    image_url: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997509_6a92ad458d1b6.png",
    status: 1,
    img: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997509_6a92ad458d1b6.png",
    category: "Special",
    desc: "Complete festive combo including heavy embroidered velvet poshak, matching pagdi, patka, and golden flute for auspicious celebrations.",
    oldPrice: "₹799.00",
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
    name: "Pearl Embedded Mor Pagdi",
    description: "Elegantly shaped mor pagdi studded with micro pearls, golden work, and real miniature peacock feather accent.",
    price: 240.0,
    sku: "PAGDI-005",
    stock_quantity: 35,
    category_id: 2,
    image_url: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997512_6a92ad483580f.png",
    status: 1,
    img: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997512_6a92ad483580f.png",
    category: "Pagdi",
    desc: "Elegantly shaped mor pagdi studded with micro pearls, golden work, and real miniature peacock feather accent.",
    oldPrice: "₹320.00",
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
    name: "Meenakari Kundan Shringar Kit",
    description: "Hand-painted meenakari with kundan embellishments for divine beauty, complete with earrings, haar, and waist belt.",
    price: 450.0,
    sku: "KUNDAN-006",
    stock_quantity: 20,
    category_id: 3,
    image_url: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997513_6a92ad495a41c.png",
    status: 1,
    img: "https://apiapp.hotelmahalaiims.com/uploads/products/1787997513_6a92ad495a41c.png",
    category: "Kundan Shringar",
    desc: "Hand-painted meenakari with kundan embellishments for divine beauty, complete with earrings, haar, and waist belt.",
    oldPrice: "₹599.00",
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
