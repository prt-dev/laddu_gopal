import React from "react";
import type { Metadata } from "next";
import BlogForm from "@/app/components/admin/BlogForm";

export const metadata: Metadata = {
  title: "Edit Blog | BlogVerse Admin",
  description: "Update blog content and SEO metadata",
};

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  return <BlogForm mode="edit" blogId={id} />;
}
