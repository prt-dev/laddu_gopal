import React from "react";
import type { Metadata } from "next";
import ProductForm from "@/app/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Edit Product | BlogVerse Admin",
  description: "Update product details and inventory",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <ProductForm mode="edit" productId={id} />;
}
