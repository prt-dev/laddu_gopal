import React from "react";
import type { Metadata } from "next";
import CategoryForm from "@/components/admin/categories/CategoryForm";

export const metadata: Metadata = {
  title: "Edit Category | Makhan Chor Admin",
  description: "Update category details and media",
};

interface EditCategoryQueryPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AdminEditCategoryQueryPage({
  searchParams,
}: EditCategoryQueryPageProps) {
  const { id } = await searchParams;
  return <CategoryForm mode="edit" categoryId={id} />;
}
