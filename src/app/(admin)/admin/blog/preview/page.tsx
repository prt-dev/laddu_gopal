import React, { Suspense } from "react";
import type { Metadata } from "next";
import BlogPreview from "@/app/components/admin/BlogPreview";

export const metadata: Metadata = {
  title: "Blog Preview | BlogVerse Admin",
  description: "Live article preview with SEO inspector and device switcher",
};

export default function AdminBlogPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-gray-500">
          Loading preview...
        </div>
      }
    >
      <BlogPreview />
    </Suspense>
  );
}
