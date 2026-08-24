import React from "react";
import Link from "next/link";
import { BlogItem } from "@/app/services/blogService";

interface BlogSidebarProps {
  recentBlogs?: BlogItem[];
}

const defaultCategories = [
  { name: "Daily Seva Vidhi & Rituals", count: 18 },
  { name: "Poshak Styling & Sizing Guide", count: 24 },
  { name: "Janmashtami & Festive Shringar", count: 15 },
  { name: "Pagdi & Kundan Craftsmanship", count: 12 },
  { name: "Devotee Experiences & Stories", count: 9 },
];

export default function BlogSidebar({ recentBlogs = [] }: BlogSidebarProps) {
  return (
    <aside className="space-y-5">
      {/* Categories */}
      <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-5">
        <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3 border-b border-[#d20b4f]/20 pb-2">
          Devotional Topics
        </h4>
        <ul className="space-y-2 p-0 list-none mb-0">
          {defaultCategories.map((c) => (
            <li key={c.name}>
              <Link
                href="/blog-preview"
                className="flex items-center justify-between text-xs font-bold text-black hover:text-[#d20b4f] transition no-underline"
              >
                <span>{c.name}</span>
                <span className="text-xs text-black">({c.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured Pagdi & Kundan Banner */}
      <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-5 text-center">
        <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-2">
          Janmashtami Special
        </h4>
        <p className="text-xs font-bold text-black mb-3">
          Explore handcrafted poshak &amp; pagdi collection curated with love.
        </p>
        <Link
          href="/shop"
          className="rounded bg-[#d20b4f] px-4 py-1.5 text-xs font-bold text-black transition hover:bg-[#b80943] no-underline inline-block"
        >
          View Collection
        </Link>
      </div>
    </aside>
  );
}
