import React from "react";
import type { Metadata } from "next";
import BlogAddForm from "@/components/admin/blogs/BlogAddForm";

export const metadata: Metadata = {
  title: "Add Blog | Makhan Chor Admin",
  description: "Create and publish a new devotional blog article",
};


export default function AdminAddBlogPage() {
  return <BlogAddForm />;
}
