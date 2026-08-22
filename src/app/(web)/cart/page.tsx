import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import CartTable from "../../components/web/CartTable";
import CartSummary from "../../components/web/CartSummary";

export const metadata: Metadata = {
  title: "Reading Cart | BlogVerse",
  description:
    "Review your selected e-books, subscriptions, and publication guides on BlogVerse.",
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        title="Cart"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pages", href: "#" },
          { label: "Cart" },
        ]}
      />

      {/* Cart Section */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <CartTable />
          <CartSummary />
        </div>
      </div>
    </>
  );
}
