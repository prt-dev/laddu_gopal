import React from "react";
import type { Metadata } from "next";
import BlogAddForm from "@/app/components/admin/BlogAddForm";

export const metadata: Metadata = {
  title: "Add Blog | BlogVerse Admin",
  description: "Create and publish a new blog article",
};

export default function AdminAddBlogPage() {
  return <BlogAddForm />;
}
