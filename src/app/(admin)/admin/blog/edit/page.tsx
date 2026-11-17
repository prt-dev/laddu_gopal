import React from "react";
import type { Metadata } from "next";
import BlogForm from "@/components/admin/blogs/BlogForm";

export const metadata: Metadata = {
  title: "Edit Blog | Makhan Chor Admin",
  description: "Update blog content and SEO metadata",
};


export default function AdminEditBlogFallbackPage() {
  return <BlogForm mode="edit" />;
}
