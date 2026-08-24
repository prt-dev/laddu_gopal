import React from "react";
import Link from "next/link";
import { BlogItem } from "@/app/services/blogService";
import { getFullImageUrl } from "@/app/utils/utils";

interface RelatedBlogsProps {
  blogs?: BlogItem[];
}

const defaultRelated = [
  {
    title: "Daily Seva Vidhi & Sizing Guide for Bal Gopal",
    excerpt: "Learn traditional Laddu Gopal seva vidhi, poshak sizing, and shringar tips.",
    date: "Aug 12, 2026",
    image: "/assets/best-selling.png",
    slug: "daily-seva-vidhi-sizing-guide",
  },
  {
    title: "How to Style Pagdi & Mor Pankh for Janmashtami",
    excerpt: "A complete step-by-step guide to dressing your Laddu Gopal for festival celebrations.",
    date: "Aug 08, 2026",
    image: "/assets/pagdi.png",
    slug: "how-to-style-pagdi-mor-pankh",
  },
  {
    title: "Significance of Kundan Shringar in Krishna Bhakti",
    excerpt: "Understanding the divine beauty and spiritual significance of handmade shringar ornaments.",
    date: "Aug 02, 2026",
    image: "/assets/kundan.png",
    slug: "significance-kundan-shringar",
  },
];

export default function RelatedBlogs({ blogs = [] }: RelatedBlogsProps) {
  const items = blogs.length > 0 ? blogs.slice(0, 3) : defaultRelated;

  return (
    <div className="mt-8 border-t border-[#fff0ad] pt-6">
      <h3 className="heading-font text-xl font-bold text-[#d20b4f] mb-4">
        Related Devotional Articles
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded border border-[#fff0ad] bg-white overflow-hidden flex flex-col">
            <div className="h-40 w-full bg-[#fff0ad]/30 p-2 flex items-center justify-center">
              <img
                src={
                  (item as any).featured_image
                    ? getFullImageUrl((item as any).featured_image)
                    : (item as any).image || "/assets/best-selling.png"
                }
                className="h-full w-full object-contain"
                alt={item.title}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <span className="text-[11px] font-bold text-black mb-1">
                <i className="fa fa-calendar-alt text-[#d20b4f] mr-1" />
                {(item as any).published_at
                  ? new Date((item as any).published_at).toLocaleDateString()
                  : (item as any).date || "August 2026"}
              </span>
              <h5 className="heading-font text-sm font-bold text-black mb-2 line-clamp-1">
                <Link
                  href={`/blog-preview?slug=${item.slug || ""}`}
                  className="text-black hover:text-[#d20b4f] no-underline"
                >
                  {item.title}
                </Link>
              </h5>
              <p className="text-xs text-black line-clamp-2 mb-3 flex-1">
                {item.excerpt}
              </p>
              <Link
                href={`/blog-preview?slug=${item.slug || ""}`}
                className="rounded bg-[#d20b4f] px-3 py-1 text-xs font-bold text-black transition hover:bg-[#b80943] no-underline self-start"
              >
                Read Article &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
