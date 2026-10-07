import { Suspense } from "react";
import type { Metadata } from "next";
import PageHeader from "@/components/web/PageHeader";
import ShopSection from "@/components/web/ShopSection";
import Spinner from "@/components/web/Spinner";

export const metadata: Metadata = {
  title: "Shop Handcrafted Poshak & Kundan Shringar | Makkanchor",
  description:
    "Explore our complete sacred collection of Laddu Gopal Poshak, Designer Pagdis, Kundan Shringar sets, Jhulas, and Bansuris.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        title="Divine Collection"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "All Items" },
        ]}
      />
      <Suspense
        fallback={
          <div className="py-20 flex justify-center items-center">
            <Spinner />
          </div>
        }
      >
        <ShopSection />
      </Suspense>
    </>
  );
}
