import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import ShopSection from "../../components/web/ShopSection";

export const metadata: Metadata = {
  title: "Shop Laddu Gopal Poshak & Shringar Collection | Makhan Chor",
  description:
    "Browse our complete handcrafted devotional collection: Pagdi, Kundan Shringar, Designer Poshak, Flutes, and Laddu Gopal accessories.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        title="Our Divine Collection"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "#categories" },
          { label: "All Items" },
        ]}
      />
      <ShopSection />
    </>
  );
}
