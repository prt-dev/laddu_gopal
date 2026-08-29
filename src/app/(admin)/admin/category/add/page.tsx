import React from "react";
import type { Metadata } from "next";
import CategoryAddForm from "@/app/components/admin/CategoryAddForm";

export const metadata: Metadata = {
  title: "Add Category | Makhan Chor Admin",
  description: "Create and publish a new category in the catalog",
};

export default function AdminAddCategoryPage() {
  return <CategoryAddForm />;
}
