import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ProductList from "@/app/components/admin/ProductList";

export const metadata: Metadata = {
  title: "Products & Publications | BlogVerse Admin",
  description: "Manage products and inventory",
};

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex items-center justify-between my-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Products Inventory
        </h2>
        <Link
          href="/admin/product/add"
          className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      <ProductList />
    </>
  );
}
