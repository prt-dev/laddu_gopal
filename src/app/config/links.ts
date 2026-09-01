/**
 * Comprehensive Configuration of all Web Links & Routes
 * Makhan Chor - Laddu Gopal Devotional Store
 */

export interface WebLinkItem {
  id: string;
  name: string;
  href: string;
  category: "main" | "resources" | "policies" | "auth" | "account" | "shop";
  description?: string;
  isPublic: boolean;
  external?: boolean;
}

// 1. Primary Header Navigation Links
export const NAV_LINKS: WebLinkItem[] = [
  {
    id: "nav-home",
    name: "Home",
    href: "/",
    category: "main",
    description: "Makhan Chor Homepage with featured collections and bestsellers",
    isPublic: true,
  },
  {
    id: "nav-shop",
    name: "Category / Shop",
    href: "/shop",
    category: "shop",
    description: "Browse all Laddu Gopal poshak, pagdi, and devotional items",
    isPublic: true,
  },
  {
    id: "nav-blogs",
    name: "Blogs",
    href: "/blogs",
    category: "resources",
    description: "Devotional stories, Janmashtami seva guides & spiritual articles",
    isPublic: true,
  },
  {
    id: "nav-contact",
    name: "Contact",
    href: "/contact",
    category: "main",
    description: "Customer care, phone, WhatsApp and store location details",
    isPublic: true,
  },
];

// 2. Footer Resources & Shopping Links
export const RESOURCE_LINKS: WebLinkItem[] = [
  {
    id: "res-all-products",
    name: "All Products",
    href: "/shop",
    category: "shop",
    description: "Complete catalogue of devotional deity poshak and shringar",
    isPublic: true,
  },
  {
    id: "res-blogs",
    name: "Blogs & Stories",
    href: "/blogs",
    category: "resources",
    description: "Spiritual insights and deity seva tips",
    isPublic: true,
  },
  {
    id: "res-testimonials",
    name: "Devotee Experiences",
    href: "/testimonial",
    category: "resources",
    description: "Customer reviews and devotee testimonials worldwide",
    isPublic: true,
  },
  {
    id: "res-contact",
    name: "Help & Support",
    href: "/contact",
    category: "main",
    description: "Direct customer assistance and queries",
    isPublic: true,
  },
];

// 3. Customer Care & Legal Policy Links
export const POLICY_LINKS: WebLinkItem[] = [
  {
    id: "policy-terms",
    name: "Terms & Conditions",
    href: "/terms-and-conditions",
    category: "policies",
    description: "Terms of service, usage guidelines, and purchasing rules",
    isPublic: true,
  },
  {
    id: "policy-refund",
    name: "Refund & Cancellation",
    href: "/refund-policy",
    category: "policies",
    description: "Return, replacement, and 7-day refund guarantee terms",
    isPublic: true,
  },
  {
    id: "policy-privacy",
    name: "Privacy Policy",
    href: "/privacy-policy",
    category: "policies",
    description: "Information security, cookie policy, and user privacy protection",
    isPublic: true,
  },
  {
    id: "policy-shipping",
    name: "Shipping & Delivery",
    href: "/shipping-policy",
    category: "policies",
    description: "Pan-India sacred packing and free expedited delivery terms",
    isPublic: true,
  },
];

// 4. Cart & Checkout Links
export const CART_CHECKOUT_LINKS: WebLinkItem[] = [
  {
    id: "cart-basket",
    name: "Devotional Basket",
    href: "/cart",
    category: "shop",
    description: "Review your selected poshaks and items",
    isPublic: true,
  },
  {
    id: "cart-checkout",
    name: "Sacred Checkout",
    href: "/checkout",
    category: "shop",
    description: "Provide delivery address and complete order",
    isPublic: true,
  },
];

// 5. Authentication & Account Links
export const AUTH_LINKS: WebLinkItem[] = [
  {
    id: "auth-login",
    name: "Devotee Login",
    href: "/login",
    category: "auth",
    description: "Access your saved addresses and order history",
    isPublic: true,
  },
  {
    id: "auth-register",
    name: "Create Account",
    href: "/register",
    category: "auth",
    description: "Join Makhan Chor devotee family",
    isPublic: true,
  },
  {
    id: "auth-forgot",
    name: "Forgot Password",
    href: "/forgot-password",
    category: "auth",
    description: "Reset your devotee portal login password",
    isPublic: true,
  },
];

// 6. Aggregated All Web Links Array
export const ALL_WEB_LINKS: WebLinkItem[] = [
  ...NAV_LINKS,
  {
    id: "nav-shop-detail",
    name: "Product Detail",
    href: "/shop-detail",
    category: "shop",
    description: "Individual deity dress or accessory view",
    isPublic: true,
  },
  {
    id: "nav-blog-preview",
    name: "Article Reader",
    href: "/blog-preview",
    category: "resources",
    description: "Full devotional article and guide preview",
    isPublic: true,
  },
  ...CART_CHECKOUT_LINKS,
  ...RESOURCE_LINKS.filter(
    (item) => !NAV_LINKS.some((nav) => nav.href === item.href)
  ),
  ...POLICY_LINKS,
  ...AUTH_LINKS,
];

// 7. Route Paths Arrays for Middleware / Route Protection Checks
export const PUBLIC_ROUTE_PATHS: string[] = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/shop",
  "/shop-detail",
  "/blogs",
  "/blog",
  "/blog-preview",
  "/contact",
  "/cart",
  "/checkout",
  "/testimonial",
  "/terms-and-conditions",
  "/terms",
  "/refund-policy",
  "/refund-and-cancellation",
  "/privacy-policy",
  "/shipping-policy",
];

export const AUTH_ROUTE_PATHS: string[] = [
  "/login",
  "/register",
  "/forgot-password",
];
