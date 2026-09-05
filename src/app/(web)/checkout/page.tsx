import type { Metadata } from "next";
import PageHeader from "../../components/web/PageHeader";
import BillingForm from "../../components/web/BillingForm";
import CheckoutOrderSummary from "../../components/web/CheckoutOrderSummary";
import { CheckoutProvider } from "@/app/context/CheckoutContext";

export const metadata: Metadata = {
  title: "Checkout & Dispatch | Makhan Chor - Laddu Gopal",
  description:
    "Complete your sacred order for handcrafted Laddu Gopal poshak and devotional accessories.",
};

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <PageHeader
        title="Sacred Order Checkout"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-7/12">
            <h2 className="heading-font text-2xl font-bold text-gray-900 mb-6">
              Devotee Delivery Address
            </h2>
            <BillingForm />
          </div>
          <CheckoutOrderSummary />
        </div>
      </div>
    </CheckoutProvider>
  );
}
