import { Suspense } from "react";
import type { Metadata } from "next";
import PageHeader from "@/components/web/PageHeader";
import ShopDetailClient from "@/components/web/ShopDetailClient";
import Spinner from "@/components/web/Spinner";

export const metadata: Metadata = {
  title: "Item Details & Specifications | Makkanchor",
  description:
    "View full specifications, deity size charts, embroidery details, and pricing for handcrafted Laddu Gopal items.",
};

export default function ShopDetailPage() {
  return (
    <>
      <PageHeader
        title="Product Details"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Product" },
        ]}
      />
      <Suspense
        fallback={
          <div className="py-20 flex justify-center items-center">
            <Spinner />
          </div>
        }
      >
        <ShopDetailClient />
      </Suspense>
    </>
  );
}
