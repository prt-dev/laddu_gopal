import { Suspense } from "react";
import type { Metadata } from "next";
import PageHeader from "@/app/components/web/PageHeader";
import BlogsGridSection from "@/app/components/web/BlogsGridSection";
import Loading from "@/app/components/common/Loading";

export const metadata: Metadata = {
  title: "Devotional Blogs, Daily Seva Vidhi & Stories | Makhan Chor",
  description:
    "Explore inspiring articles, Laddu Gopal poshak sizing guides, Janmashtami seva rituals, and Kundan shringar traditions.",
};

export default function BlogsPage() {
  return (
    <>
      <PageHeader
        title="Devotional Blogs & Seva Guides"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/blogs" },
          { label: "Devotional Blogs" },
        ]}
      />

      <Suspense
        fallback={
          <div className="py-20 flex justify-center items-center">
            <Loading
              variant="container"
              size="lg"
              message="Loading Devotional Articles..."
            />
          </div>
        }
      >
        <BlogsGridSection />
      </Suspense>
    </>
  );
}
