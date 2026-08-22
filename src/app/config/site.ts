export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "BlogVerse",
  title: process.env.NEXT_PUBLIC_SITE_TITLE || "BlogVerse - Modern Blogging & Content Publishing Platform",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "editorial@blogverse.io",
  phone1: process.env.NEXT_PUBLIC_CONTACT_PHONE_1 || "+1 (555) 234-5678",
  phone2: process.env.NEXT_PUBLIC_CONTACT_PHONE_2 || "+1 (555) 876-5432",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "100 Innovation Way, Suite 400, San Francisco, CA 94107, USA",
  currency: "₹",
  logo: {
    src: "/assets/logo.webp",
    alt: "BlogVerse Logo",
    width: 200,
    height: 60,
  },
  favicon: "/assets/logo.webp",
};
