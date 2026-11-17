import ShopPage from "../shop/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Makkanchor",
  description: "Browse all sacred Laddu Gopal poshaks, shringar and devotional items.",
};

export default function ProductsPage() {
  return <ShopPage />;
}
