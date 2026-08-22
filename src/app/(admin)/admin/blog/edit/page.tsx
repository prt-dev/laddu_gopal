import React from "react";
import type { Metadata } from "next";
import BlogForm from "@/app/components/admin/BlogForm";

export const metadata: Metadata = {
  title: "Edit Blog | BlogVerse Admin",
  description: "Update blog content and SEO metadata",
};

export default function AdminEditBlogFallbackPage() {
  return <BlogForm mode="edit" />;
}
