import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import ProductDetail from "../../components/web/ProductDetail";
import DetailSidebar from "../../components/web/DetailSidebar";
import RelatedProducts from "../../components/web/RelatedProducts";

export const metadata: Metadata = {
  title: "Publication Detail | BlogVerse",
  description:
    "View full details, chapters, reviews, and related publications on BlogVerse.",
};

export default function ShopDetailPage() {
  return (
    <>
      <PageHeader
        title="Publication Detail"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Publications", href: "/shop" },
          { label: "Publication Detail" },
        ]}
      />

      {/* Single Product Section */}
      <div className="container-fluid py-5 mt-5">
        <div className="container py-5">
          <div className="row g-4 mb-5">
            <ProductDetail />
            <DetailSidebar />
          </div>
          <RelatedProducts />
        </div>
      </div>
    </>
  );
}
