import React from "react";
import type { Metadata } from "next";
import BlogAddForm from "@/app/components/admin/BlogAddForm";

export const metadata: Metadata = {
  title: "Add Blog | Makhan Chor Admin",
  description: "Create and publish a new devotional blog article",
};


export default function AdminAddBlogPage() {
  return <BlogAddForm />;
}
