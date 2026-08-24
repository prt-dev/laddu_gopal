export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Makhan Chor - Laddu Gopal",
  title: process.env.NEXT_PUBLIC_SITE_TITLE || "Makhan Chor - Laddu Gopal | Premium Poshak, Pagdi & Shringar",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@makhanchorladdugopal.com",
  phone1: process.env.NEXT_PUBLIC_CONTACT_PHONE_1 || "8013395004",
  phone2: process.env.NEXT_PUBLIC_CONTACT_PHONE_2 || "8013395004",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "College More, Kanchrapara, Kolkata, West Bengal 743145",
  currency: "₹",
  logo: {
    src: "/assets/logo.png",
    alt: "Makhan Chor Logo",
    width: 140,
    height: 60,
  },
  favicon: "/assets/logo.png",
};

