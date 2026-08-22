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
  title: "The Architecture of Autonomous AI Agents & Real-Time Systems in 2026",
  slug: "architecture-autonomous-ai-agents-2026",
  excerpt:
    "An in-depth exploration of multi-agent orchestration, streaming tool execution, and self-correcting neural loops shaping future software development.",
  content: `
    <p class="lead">
      Software engineering in 2026 is experiencing an extraordinary paradigm shift. With autonomous agent frameworks maturing and real-time streaming inference reaching sub-second milestones, developers are transitioning from monolithic REST architectures to event-driven multi-agent networks.
    </p>

    <h3 class="fw-bold mt-4 mb-3 text-dark">1. Multi-Agent Orchestration &amp; Distributed Memory</h3>
    <p>
      Modern systems decompose complex business logic across swarms of specialized agent personas. Rather than overloading single model contexts, deterministic supervisor agents route subtasks to focused execution nodes with isolated memory partitions.
    </p>
    <p>
      Context compression techniques and vector indexing ensure agents maintain durable conversational memory across millions of state transitions without losing precision.
    </p>

    <div class="my-4 p-4 rounded bg-light border-start border-4 border-primary">
      <h5 class="fw-bold text-dark mb-1">Key Performance Metric</h5>
      <p class="mb-0 text-muted">
        Multi-agent decomposition workflows reduce hallucination rates by over 64% while maintaining sub-second intermediate token streaming.
      </p>
    </div>

    <h3 class="fw-bold mt-4 mb-3 text-dark">2. Sandboxed Tool Execution &amp; Self-Correction</h3>
    <p>
      Autonomous agents validate their work before presenting it to users. When an agent writes code or performs schema migrations, it executes test suites inside isolated WASM or micro-VM containers, inspecting stderr and automatically refining solutions until all assertions pass.
    </p>

    <h3 class="fw-bold mt-4 mb-3 text-dark">3. The Future: Next.js Streaming SSR &amp; Edge Delivery</h3>
    <p>
      By marrying agent intelligence with Next.js 15 Server Components and Edge routing, readers experience zero-latency interaction models where analytical charts, markdown tables, and code snippets stream dynamically into view.
    </p>
  `,
  featured_image: "/assets/img/featur-2.jpg",
  status: 1,
  published_at: new Date().toISOString(),
  meta_title: "The Architecture of Autonomous AI Agents 2026 | BlogVerse",
  meta_description: "Learn how multi-agent networks and sandboxed tool execution are transforming modern software development.",
};

const sampleClient: ClientItem = {
  id: 1,
  name: "TechSphere Insights",
  website_name: "TechSphere Official Blog",
  website_url: "https://techsphere.blogverse.io",
  domain: "techsphere.blogverse.io",
  logo: "",
  default_meta_title: "TechSphere Insights - Cutting-Edge Technology & Architecture",
  default_meta_description:
    "Deep dive articles on distributed systems, AI engineering, and modern web design.",
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

        // Fetch recent blogs for sidebar
        const allBlogs = await getBlogs({ limit: 4 }, "").catch(() => ({ blogs: [] }));
        if (allBlogs?.blogs) {
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
        title={blog.title || "Blog Preview"}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blogs", href: "/blog-preview" },
          { label: "Article Preview" },
        ]}
      />

      <div className="container-fluid py-5 mt-4">
        <div className="container py-4">
          <div className="row g-4">
            <BlogDetail blog={blog} client={client} />
            <BlogSidebar client={client} recentBlogs={recentBlogs} />
          </div>

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
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading blog preview...</span>
          </div>
        </div>
      }
    >
      <BlogPreviewContent />
    </Suspense>
  );
}
