import type { Metadata } from "next";
import BlogPreviewClient from "@/app/components/web/BlogPreviewClient";

export const metadata: Metadata = {
  title: "Devotional Blogs & Seva Guides | Makhan Chor",
  description:
    "Explore devotional insights, Laddu Gopal poshak sizing guides, pagdi styling tips, and festive seva vidhi.",
};

export default function BlogPreviewPage() {
  return <BlogPreviewClient />;
}
