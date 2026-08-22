import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import BlogList from "@/app/components/admin/BlogList";

export const metadata: Metadata = {
  title: "Blogs | BlogVerse Admin",
  description: "Manage and create blogs on BlogVerse",
};

export default function AdminBlogsPage() {
  return (
    <>
      <div className="flex items-center justify-between my-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Blogs & Articles
        </h2>
        <Link
          href="/admin/blog/add"
          className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple transition-colors"
        >
          + Add New Blog
        </Link>
      </div>

      <BlogList />
    </>
  );
}
