import React from "react";
import type { Metadata } from "next";
import BlogPreview from "@/app/components/admin/BlogPreview";

export const metadata: Metadata = {
  title: "Blog Article Preview | BlogVerse Admin",
  description: "Live article preview with SEO inspector and device switcher",
};

interface PreviewBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPreviewBlogPage({ params }: PreviewBlogPageProps) {
  const { id } = await params;
  return <BlogPreview blogId={id} />;
}
