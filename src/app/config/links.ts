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
    href: "/blog-preview",
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
    href: "/blog-preview",
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

// 3. Customer Care, Legal & Policy Links
export const POLICY_LINKS: WebLinkItem[] = [
  {
    id: "policy-terms",
    name: "Terms & Conditions",
    href: "/terms-and-conditions",
    category: "policies",
    description: "Store usage rules, pricing, sizing & legal terms",
    isPublic: true,
  },
  {
    id: "policy-refund",
    name: "Refund & Cancellation",
    href: "/refund-policy",
    category: "policies",
    description: "Returns, unboxing video criteria & refund timelines",
    isPublic: true,
  },
  {
    id: "policy-privacy",
    name: "Privacy Policy",
    href: "/privacy-policy",
    category: "policies",
    description: "Customer data protection, payment security & privacy guidelines",
    isPublic: true,
  },
  {
    id: "policy-shipping",
    name: "Shipping & Delivery",
    href: "/shipping-policy",
    category: "policies",
    description: "Pan-India delivery times, courier partners & express shipping",
    isPublic: true,
  },
];

// 4. Authentication & Account Access Links
export const AUTH_LINKS: WebLinkItem[] = [
  {
    id: "auth-login",
    name: "Login",
    href: "/login",
    category: "auth",
    description: "Sign in to customer account",
    isPublic: true,
  },
  {
    id: "auth-register",
    name: "Register",
    href: "/register",
    category: "auth",
    description: "Create a new devotee customer account",
    isPublic: true,
  },
  {
    id: "auth-forgot-password",
    name: "Forgot Password",
    href: "/forgot-password",
    category: "auth",
    description: "Reset account login password",
    isPublic: true,
  },
];

// 5. Checkout & Cart Flow Links
export const CART_CHECKOUT_LINKS: WebLinkItem[] = [
  {
    id: "cart-view",
    name: "Shopping Cart",
    href: "/cart",
    category: "account",
    description: "View selected items, quantities & subtotal",
    isPublic: true,
  },
  {
    id: "checkout-page",
    name: "Checkout",
    href: "/checkout",
    category: "account",
    description: "Shipping address selection and payment confirmation",
    isPublic: true,
  },
];

// 6. Master Array of ALL Web Links
export const ALL_WEB_LINKS: WebLinkItem[] = [
  ...NAV_LINKS,
  {
    id: "nav-shop-detail",
    name: "Product Details",
    href: "/shop-detail",
    category: "shop",
    description: "Individual deity dress or accessory view",
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
