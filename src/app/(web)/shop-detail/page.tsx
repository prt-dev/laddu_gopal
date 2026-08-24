import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import ProductDetail from "../../components/web/ProductDetail";
import DetailSidebar from "../../components/web/DetailSidebar";
import RelatedProducts from "../../components/web/RelatedProducts";

export const metadata: Metadata = {
  title: "Laddu Gopal Poshak Detail | Makhan Chor",
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
          { label: "Poshak Details" },
        ]}
      />

      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          <ProductDetail />
          <DetailSidebar />
        </div>
        <RelatedProducts />
      </div>
    </>
  );
}
