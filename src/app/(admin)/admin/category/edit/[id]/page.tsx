import React from "react";
import type { Metadata } from "next";
import CategoryForm from "@/app/components/admin/CategoryForm";

export const metadata: Metadata = {
  title: "Edit Category | Makhan Chor Admin",
  description: "Update category details and media",
};

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  return <CategoryForm mode="edit" categoryId={id} />;
}
