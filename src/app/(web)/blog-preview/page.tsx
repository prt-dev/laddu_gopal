"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/app/components/web/PageHeader";
import BlogDetail from "@/app/components/web/BlogDetail";
import BlogSidebar from "@/app/components/web/BlogSidebar";
import RelatedBlogs from "@/app/components/web/RelatedBlogs";
import { BlogItem, getBlogBySlug, getBlogById, getBlogs } from "@/app/services/blogService";
import { ClientItem, getClientById } from "@/app/services/clientService";

const sampleBlog: BlogItem = {
  id: 1,
  client_id: 1,
  title: "The Sacred Art of Laddu Gopal Shringar: Daily Seva Vidhi & Kundan Ornaments",
  slug: "sacred-art-laddu-gopal-shringar-seva-vidhi",
  excerpt:
    "Discover how devotees lovingly adorn Thakur Ji with handcrafted Zari poshaks, embroidered pagdis, and radiant Kundan ornaments for daily seva and Janmashtami celebrations.",
  content: `
    <p class="lead">
      In Sanatan tradition, serving <strong>Laddu Gopal Ji</strong> is not merely a ritual, but an intimate expression of Vatsalya Bhava (parental affection and devotion). Adorning Thakur Ji each morning brings spiritual bliss, peace, and abundance into our homes.
    </p>

    <h3 class="fw-bold mt-4 mb-3 text-dark">1. Choosing the Right Poshak &amp; Fabric according to Seasons</h3>
    <p>
      During summer months, light cotton and silk fabrics in soothing pastels keep Bal Gopal comfortable. For festive occasions like Janmashtami, Radhashtami, and Diwali, rich velvet and zardozi embellished poshaks with delicate brocade borders are traditionally offered.
    </p>

    <div class="my-4 p-4 rounded-2xl bg-[#fff0ad]/30 border border-[#fff0ad]">
      <h5 class="fw-bold text-[#d20b4f] mb-1">✨ Devotional Seva Tip</h5>
      <p class="mb-0 text-gray-800">
        Always ensure poshak sizes correspond exactly to your Laddu Gopal idol (Size 0 for 2.5", Size 2 for 3.5", Size 4 for 4.5", up to Size 12) for graceful fitting and comfort.
      </p>
    </div>

    <h3 class="fw-bold mt-4 mb-3 text-dark">2. The Grandeur of Pagdi &amp; Peacock Feather (Mor Pankh)</h3>
    <p>
      The crown or Pagdi symbolizes the royal sovereignty of Shri Krishna. A delicately sculpted Pagdi studded with micro-pearls and centered with a pure Mor Pankh elevates the divine beauty of Bal Gopal.
    </p>

    <h3 class="fw-bold mt-4 mb-3 text-dark">3. Adorning with Kundan Haar, Bangles &amp; Bansuri</h3>
    <p>
      No shringar is complete without the sweet golden flute (Bansuri), gleaming Kundan neckpieces, and tiny hand-painted meenakari bangles. At Makhan Chor, every piece is curated with pure love as if offering to our own beloved Thakur Ji.
    </p>
  `,
  featured_image: "/assets/hero.png",
  status: 1,
  published_at: new Date().toISOString(),
  meta_title: "The Sacred Art of Laddu Gopal Shringar | Makhan Chor",
  meta_description: "Learn traditional Laddu Gopal seva vidhi, poshak sizing, and shringar tips.",
};

const sampleClient: ClientItem = {
  id: 1,
  name: "Makhan Chor Editorial",
  website_name: "Makhan Chor Devotional Stories",
  website_url: "https://makhanchorladdugopal.com",
  domain: "makhanchorladdugopal.com",
  logo: "/assets/logo.png",
  default_meta_title: "Makhan Chor Devotional Guides & Seva Vidhi",
  default_meta_description:
    "Inspiring stories and guides for Krishna devotees worldwide.",
  status: 1,
};

function BlogPreviewContent() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");
  const idParam = searchParams.get("id");

  const [blog, setBlog] = useState<BlogItem>(sampleBlog);
  const [client, setClient] = useState<ClientItem | null>(sampleClient);
  const [recentBlogs, setRecentBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(slugParam || idParam));

  useEffect(() => {
    const fetchLiveBlog = async () => {
      try {
        setIsLoading(true);
        let fetchedBlog: BlogItem | null = null;

        if (slugParam) {
          fetchedBlog = await getBlogBySlug(slugParam, "").catch(() => null);
        } else if (idParam) {
          fetchedBlog = await getBlogById(Number(idParam), "").catch(() => null);
        }

        if (fetchedBlog) {
          setBlog(fetchedBlog);
          if (fetchedBlog.client_id) {
            const clientData = await getClientById(fetchedBlog.client_id, "").catch(() => null);
            if (clientData) setClient(clientData);
          }
        }

        const allBlogs = await getBlogs({ limit: 4 }, "").catch(() => ({ blogs: [] }));
        if (allBlogs?.blogs && allBlogs.blogs.length > 0) {
          setRecentBlogs(allBlogs.blogs);
        }
      } catch (err) {
        console.error("Failed to load live preview blog:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveBlog();
  }, [slugParam, idParam]);

  return (
    <>
      <PageHeader
        title={blog.title || "Devotional Blogs"}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blogs", href: "/blog-preview" },
          { label: "Article Preview" },
        ]}
      />

      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <BlogDetail blog={blog} client={client} />
          </div>
          <div className="lg:col-span-4">
            <BlogSidebar client={client} recentBlogs={recentBlogs} />
          </div>
        </div>

        <div className="mt-12">
          <RelatedBlogs blogs={recentBlogs} />
        </div>
      </div>
    </>
  );
}

export default function BlogPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center">
          <div className="spinner-border text-[#d20b4f]" role="status">
            <span className="visually-hidden">Loading blog preview...</span>
          </div>
        </div>
      }
    >
      <BlogPreviewContent />
    </Suspense>
  );
}
