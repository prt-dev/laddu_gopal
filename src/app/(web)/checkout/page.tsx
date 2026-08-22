import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import BillingForm from "../../components/web/BillingForm";
import CheckoutOrderSummary from "../../components/web/CheckoutOrderSummary";

export const metadata: Metadata = {
  title: "Checkout | BlogVerse",
  description:
    "Complete your order for digital publications, guides, and premium memberships on BlogVerse.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        title="Checkout"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Pages", href: "#" },
          { label: "Checkout" },
        ]}
      />

      {/* Checkout Section */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <h1 className="mb-4">Billing details</h1>
          <form action="#">
            <div className="row g-5">
              <BillingForm />
              <CheckoutOrderSummary />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
