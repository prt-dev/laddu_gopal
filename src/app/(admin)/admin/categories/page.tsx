import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CategoryList from "@/app/components/admin/CategoryList";

export const metadata: Metadata = {
  title: "Categories | Makhan Chor Admin",
  description: "Manage product categories, hierarchies, and catalogs",
};

export default function AdminCategoriesPage() {
  return (
    <>
      <div className="flex items-center justify-between my-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Categories Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Organize catalog structure, parent-child groups, and remote visual assets.
          </p>
        </div>
        <Link
          href="/admin/category/add"
          className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple transition-colors"
        >
          + Add New Category
        </Link>
      </div>

      <CategoryList />
    </>
  );
}
