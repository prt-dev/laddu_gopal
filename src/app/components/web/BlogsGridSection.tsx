"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BlogItem, getBlogs } from "@/app/services/blogService";
import { getFullImageUrl } from "@/app/utils/utils";
import Loading from "@/app/components/common/Loading";

// Curated Devotional Sample Articles for rich fallback & instant rendering
const fallbackDevotionalBlogs: BlogItem[] = [
  {
    id: 1,
    title: "The Sacred Art of Laddu Gopal Shringar: Daily Seva Vidhi & Kundan Ornaments",
    slug: "sacred-art-laddu-gopal-shringar-seva-vidhi",
    excerpt:
      "Discover how devotees lovingly adorn Thakur Ji with handcrafted Zari poshaks, embroidered pagdis, and radiant Kundan ornaments for daily seva and Janmashtami celebrations.",
    featured_image: "/assets/best-selling.png",
    published_at: "2026-08-20T09:00:00Z",
    meta_title: "Laddu Gopal Daily Seva & Kundan Shringar Guide",
    meta_description: "Learn traditional Laddu Gopal seva vidhi, poshak sizing, and shringar tips.",
  },
  {
    id: 2,
    title: "Seasonal Poshak Guide: Choosing Summer Cotton & Festive Silk for Bal Gopal",
    slug: "seasonal-poshak-guide-summer-cotton-festive-silk",
    excerpt:
      "A complete guide on selecting breathable summer cotton poshaks and magnificent zardozi velvet dresses according to traditional Sanatan seasonal seva customs.",
    featured_image: "/assets/poshak.png",
    published_at: "2026-08-16T10:30:00Z",
    meta_title: "Seasonal Poshak Selection Guide",
  },
  {
    id: 3,
    title: "How to Style Pagdi & Mor Pankh for Janmashtami & Festive Celebrations",
    slug: "how-to-style-pagdi-mor-pankh",
    excerpt:
      "Step-by-step styling tips for crowning Thakur Ji with handcrafted zari pagdis, pearl chandrikas, and sacred peacock feathers (Mor Pankh).",
    featured_image: "/assets/pagdi.png",
    published_at: "2026-08-12T14:15:00Z",
    meta_title: "Pagdi & Mor Pankh Styling Guide",
  },
  {
    id: 4,
    title: "Significance of Kundan Shringar & Bansuri in Krishna Bhakti",
    slug: "significance-kundan-shringar",
    excerpt:
      "Explore the spiritual symbolism behind Bal Gopal's sacred jewelry—from the pearl haar to the golden flute—and how seva purifies our devotion.",
    featured_image: "/assets/kundan.png",
    published_at: "2026-08-05T08:00:00Z",
    meta_title: "Spiritual Meaning of Krishna Shringar",
  },
  {
    id: 5,
    title: "Thakur Ji Sizing & Measurement Handbook: Sizes 0 to 6 Explained",
    slug: "thakur-ji-sizing-measurement-handbook",
    excerpt:
      "Never order the wrong size again. A comprehensive visual measurement chart to choose the exact poshak and pagdi size for your beloved Laddu Gopal idol.",
    featured_image: "/assets/logo.png",
    published_at: "2026-07-28T11:00:00Z",
    meta_title: "Laddu Gopal Size Chart & Measurement Guide",
  },
  {
    id: 6,
    title: "Bhog Offering & Divine Aarti Rituals for Daily Morning & Evening Seva",
    slug: "bhog-offering-divine-aarti-rituals",
    excerpt:
      "Purify your home with simple daily bhog vidhi (Makhan, Mishri, Tulsi Dal) and heartfelt evening mangala aarti traditions that invite endless divine grace.",
    featured_image: "/assets/best-selling.png",
    published_at: "2026-07-20T16:45:00Z",
    meta_title: "Bhog Offering & Daily Aarti Vidhi",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Sacred Articles" },
  { id: "seva", label: "Daily Seva Vidhi" },
  { id: "poshak", label: "Poshak & Sizing" },
  { id: "shringar", label: "Kundan & Shringar" },
  { id: "festivals", label: "Festivals & Janmashtami" },
];

export default function BlogsGridSection() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [emailSubscribed, setEmailSubscribed] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");

  // Fetch blogs from API or use rich devotional fallback
  useEffect(() => {
    let isMounted = true;
    async function loadBlogsData() {
      try {
        setIsLoading(true);
        const data = await getBlogs({ limit: 50 }, "");
        if (isMounted) {
          if (data?.blogs && Array.isArray(data.blogs) && data.blogs.length > 0) {
            setBlogs(data.blogs);
          } else if (Array.isArray(data) && data.length > 0) {
            setBlogs(data);
          } else {
            setBlogs(fallbackDevotionalBlogs);
          }
        }
      } catch (err) {
        console.warn("Using offline devotional blog fallback:", err);
        if (isMounted) {
          setBlogs(fallbackDevotionalBlogs);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBlogsData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter & Sort Blogs
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(q) ||
          (b.excerpt || "").toLowerCase().includes(q) ||
          (b.slug || "").toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "all") {
      result = result.filter((b) => {
        const text = `${b.title} ${b.excerpt} ${b.slug}`.toLowerCase();
        if (selectedCategory === "seva") return text.includes("seva") || text.includes("vidhi") || text.includes("bhog");
        if (selectedCategory === "poshak") return text.includes("poshak") || text.includes("size") || text.includes("sizing");
        if (selectedCategory === "shringar") return text.includes("kundan") || text.includes("shringar") || text.includes("pagdi");
        if (selectedCategory === "festivals") return text.includes("janmashtami") || text.includes("festive") || text.includes("festival");
        return true;
      });
    }

    // 3. Sort
    if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.published_at || b.created_at || "").getTime() - new Date(a.published_at || a.created_at || "").getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.published_at || a.created_at || "").getTime() - new Date(b.published_at || b.created_at || "").getTime());
    } else if (sortBy === "alpha") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [blogs, selectedCategory, searchQuery, sortBy]);

  // Featured Spotlight Article (first item)
  const featuredBlog = filteredBlogs[0];
  const gridBlogs = filteredBlogs.slice(1);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setEmailSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-10">
      {/* 1. Interactive Control Bar: Search & Category Pills */}
      <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search seva guides, poshak tips, shringar rituals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-[#fff0ad] bg-white px-4 py-2.5 pl-10 text-xs font-semibold text-black placeholder-gray-400 shadow-2xs focus:border-[#d20b4f] focus:outline-none"
          />
          <i className="fa fa-search absolute left-3.5 top-3.5 text-xs text-[#d20b4f]" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-black border-0 bg-transparent cursor-pointer"
            >
              <i className="fa fa-times" />
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-xs font-bold text-gray-600 hidden sm:inline">
            Showing <strong className="text-[#d20b4f]">{filteredBlogs.length}</strong> articles
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-[#fff0ad] bg-white px-3 py-2 text-xs font-bold text-black shadow-2xs focus:border-[#d20b4f] focus:outline-none cursor-pointer"
            >
              <option value="latest">Latest Published</option>
              <option value="oldest">Oldest First</option>
              <option value="alpha">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-[#fff0ad] pb-4">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all border cursor-pointer ${
                isActive
                  ? "bg-[#d20b4f] text-white border-[#d20b4f] shadow-xs"
                  : "bg-white text-black border-[#fff0ad] hover:border-[#d20b4f]/40 hover:bg-[#fff0ad]/30"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Loading State */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loading
            variant="container"
            size="lg"
            message="Loading Devotional Seva Guides & Articles..."
          />
        </div>
      ) : filteredBlogs.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center bg-[#fff0ad]/20 rounded-xl border border-[#fff0ad] p-8">
          <div className="h-16 w-16 rounded-full bg-[#fff0ad] flex items-center justify-center mx-auto mb-4 text-[#d20b4f]">
            <i className="fa fa-book-open text-2xl" />
          </div>
          <h3 className="heading-font text-lg font-bold text-black mb-2">
            No Devotional Articles Found
          </h3>
          <p className="text-xs text-gray-600 mb-5 max-w-sm mx-auto">
            We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;. Try adjusting your keywords or category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="rounded bg-[#d20b4f] px-5 py-2 text-xs font-bold text-white hover:bg-[#b80943] transition border-0 cursor-pointer shadow-xs"
          >
            Reset Filters &amp; View All
          </button>
        </div>
      ) : (
        <>
          {/* 4. Featured Spotlight Article Banner */}
          {featuredBlog && !searchQuery && selectedCategory === "all" && (
            <div className="mb-10 rounded-2xl border border-[#fff0ad] bg-gradient-to-r from-[#fff0ad]/40 via-white to-[#fff0ad]/20 p-5 sm:p-7 shadow-xs hover:shadow-md transition">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Image */}
                <div className="lg:col-span-5 h-56 sm:h-64 rounded-xl bg-[#fff0ad]/60 p-4 flex items-center justify-center border border-[#fff0ad] overflow-hidden">
                  <img
                    src={
                      featuredBlog.featured_image
                        ? getFullImageUrl(featuredBlog.featured_image)
                        : "/assets/best-selling.png"
                    }
                    alt={featuredBlog.title || "Featured Blog"}
                    className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="rounded-full bg-[#d20b4f] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      Featured Guide
                    </span>
                    <span className="text-[11px] font-bold text-gray-500">
                      <i className="fa fa-clock text-[#d20b4f] mr-1" />
                      5 min read
                    </span>
                  </div>

                  <h2 className="heading-font text-xl sm:text-2xl font-bold text-black mb-3 leading-snug">
                    <Link
                      href={`/blog-preview?slug=${featuredBlog.slug || featuredBlog.id}`}
                      className="text-black hover:text-[#d20b4f] no-underline transition"
                    >
                      {featuredBlog.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-3 mb-5">
                    {featuredBlog.excerpt}
                  </p>

                  <div className="flex items-center justify-between border-t border-[#d20b4f]/10 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-[#fff0ad] flex items-center justify-center text-[#d20b4f] font-bold text-xs">
                        🌸
                      </div>
                      <span className="text-xs font-bold text-black">
                        Makhan Chor Seva Editorial
                      </span>
                    </div>

                    <Link
                      href={`/blog-preview?slug=${featuredBlog.slug || featuredBlog.id}`}
                      className="rounded bg-[#d20b4f] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs inline-flex items-center gap-1.5"
                    >
                      Read Full Guide &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Devotional Blogs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery || selectedCategory !== "all" ? filteredBlogs : gridBlogs).map(
              (blog, idx) => {
                const blogDate = blog.published_at || blog.created_at;
                const formattedDate = blogDate
                  ? new Date(blogDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "August 2026";

                return (
                  <article
                    key={blog.id || blog.slug || idx}
                    className="flex flex-col rounded-xl border border-[#fff0ad] bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/blog-preview?slug=${blog.slug || blog.id}`}
                      className="relative block h-48 w-full bg-[#fff0ad]/40 p-4 overflow-hidden group text-center"
                    >
                      <img
                        src={
                          blog.featured_image
                            ? getFullImageUrl(blog.featured_image)
                            : "/assets/best-selling.png"
                        }
                        alt={blog.title || "Blog Article"}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded bg-white/95 px-2 py-0.5 text-[10px] font-bold text-[#d20b4f] shadow-2xs">
                        Devotional Seva
                      </span>
                    </Link>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* Meta */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-2">
                        <span>
                          <i className="fa fa-calendar-alt text-[#d20b4f] mr-1" />
                          {formattedDate}
                        </span>
                        <span>
                          <i className="fa fa-book-reader text-[#d20b4f] mr-1" />
                          4 min read
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="heading-font text-base font-bold text-black mb-2 leading-snug line-clamp-2">
                        <Link
                          href={`/blog-preview?slug=${blog.slug || blog.id}`}
                          className="text-black hover:text-[#d20b4f] no-underline transition"
                        >
                          {blog.title}
                        </Link>
                      </h4>

                      {/* Excerpt */}
                      <p className="text-xs text-gray-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      {/* Footer CTA */}
                      <div className="border-t border-[#fff0ad] pt-3 flex items-center justify-between mt-auto">
                        <span className="text-[11px] font-bold text-[#d20b4f]">
                          Seva Guide
                        </span>
                        <Link
                          href={`/blog-preview?slug=${blog.slug || blog.id}`}
                          className="text-xs font-bold text-[#d20b4f] hover:text-[#b80943] no-underline inline-flex items-center gap-1 group"
                        >
                          Read Story
                          <span className="transition-transform group-hover:translate-x-0.5">
                            &rarr;
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </>
      )}

      {/* 6. Spiritual Newsletter & Seva Digest Callout */}
      <div className="mt-14 rounded-2xl border border-[#fff0ad] bg-gradient-to-br from-[#fff0ad] via-white to-[#fff0ad]/60 p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto max-w-xl">
          <div className="h-12 w-12 rounded-full bg-[#d20b4f] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <i className="fa fa-envelope-open-text text-xl" />
          </div>
          <h3 className="heading-font text-xl sm:text-2xl font-bold text-black mb-2">
            Stay Connected with Thakur Ji Seva &amp; Utsav Updates
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 mb-6">
            Receive monthly poshak styling tips, festive Janmashtami muhurat reminders, and auspicious devotional stories straight to your inbox.
          </p>

          {emailSubscribed ? (
            <div className="p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-xs font-bold inline-block">
              🌸 Radhe Radhe! Thank you for subscribing to our devotional newsletter.
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-xs font-medium text-black placeholder-gray-400 focus:border-[#d20b4f] focus:outline-none shadow-2xs"
              />
              <button
                type="submit"
                className="w-full sm:w-auto whitespace-nowrap rounded-full bg-[#d20b4f] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#b80943] border-0 cursor-pointer shadow-xs"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
