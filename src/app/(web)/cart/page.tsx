import type { Metadata } from "next";
import PageHeader from "@/components/web/PageHeader";
import CartTable from "@/components/web/CartTable";

export const metadata: Metadata = {
  title: "Shopping Basket & Cart | Makkanchor",
  description:
    "Review your selected Laddu Gopal poshak, pagdi, and kundan shringar items in your basket.",
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        title="Your Devotional Basket"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Basket Items" },
        ]}
      />

      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <CartTable />
      </div>
    </>
  );
}
