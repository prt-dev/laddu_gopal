import { Suspense } from "react";
import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import ShopDetailClient from "../../components/web/ShopDetailClient";
import Spinner from "../../components/web/Spinner";

export const metadata: Metadata = {
  title: "Laddu Gopal Item Details | Makhan Chor",
  description:
    "View full details, size options, embroidery specifications, and devotee reviews for handcrafted Laddu Gopal items.",
};

export default function ShopDetailPage() {
  return (
    <>
      <PageHeader
        title="Item Details &amp; Specifications"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Collection", href: "/shop" },
          { label: "Item Details" },
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
