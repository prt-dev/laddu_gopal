import React from "react";
import type { Metadata } from "next";
import ProductAddForm from "@/app/components/admin/ProductAddForm";

export const metadata: Metadata = {
  title: "Add Product | BlogVerse Admin",
  description: "Create and publish a new product in the catalog",
};

export default function AdminAddProductPage() {
  return <ProductAddForm />;
}
