import React from "react";
import type { Metadata } from "next";
import ProductForm from "@/app/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Edit Product | BlogVerse Admin",
  description: "Update product details and inventory",
};

interface EditProductQueryPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AdminEditProductQueryPage({
  searchParams,
}: EditProductQueryPageProps) {
  const { id } = await searchParams;
  return <ProductForm mode="edit" productId={id} />;
}
