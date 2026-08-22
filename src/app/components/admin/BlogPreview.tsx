"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlogItem, getBlogById, getBlogBySlug } from "@/app/services/blogService";
import { ClientItem, getClientById } from "@/app/services/clientService";
import { useAuth } from "@/app/context/AuthContext";
import { getFullImageUrl } from "@/app/utils/utils";

interface BlogPreviewProps {
  blogId?: number | string;
  slug?: string;
}

const sampleBlog: BlogItem = {
  id: 101,
  client_id: 1,
  title: "The Architecture of Autonomous AI Agents & Real-Time Systems in 2026",
  slug: "architecture-autonomous-ai-agents-2026",
  excerpt:
    "Explore how multi-agent orchestration, streaming tool execution, and self-correcting neural loops are reshaping modern software engineering.",
  content: `
    <p class="mb-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
      Software architecture in 2026 is experiencing a seismic paradigm shift. With autonomous agent frameworks maturing and multimodal models operating at ultra-low latency, engineers are transitioning from static monolithic APIs to event-driven multi-agent orchestration networks.
    </p>

    <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
      1. Multi-Agent Orchestration &amp; Distributed Memory
    </h2>
    <p class="mb-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
      Modern AI systems no longer rely on single monolithic prompts. Specialized agents collaborate over structured message buses, decomposing complex analytical queries into deterministic subtasks with verifiable validation steps.
    </p>

    <div class="my-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-600">
      <h4 class="font-bold text-purple-900 dark:text-purple-300 text-sm mb-1">
        Key Performance Metric
      </h4>
      <p class="text-sm text-purple-800 dark:text-purple-200 mb-0">
        Multi-agent decomposition workflows reduce hallucination rates by over 64% while maintaining sub-second intermediate token streaming.
      </p>
    </div>

    <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
      2. Self-Correcting Execution &amp; Tool Sandboxing
    </h2>
    <p class="mb-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
      Dynamic feedback loops allow autonomous agents to execute sandbox code, inspect compiler diagnostics, and automatically iterate until assertions succeed before committing changes to production branches.
    </p>

    <h2 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
      3. Real-Time Streaming SSR &amp; Edge Delivery
    </h2>
    <p class="mb-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
      By pairing Next.js App Router streaming with edge compute nodes, readers receive instant conversational answers, interactive diagrams, and live execution traces without visual layout shifts.
    </p>
  `,
  featured_image: "/assets/img/featur-2.jpg",
  status: 1,
  published_at: new Date().toISOString(),
  meta_title: "The Architecture of Autonomous AI Agents 2026 | BlogVerse",
  meta_description:
    "In-depth architectural breakdown of multi-agent orchestration, streaming tool execution, and modern AI engineering patterns.",
  canonical_url: "https://blogverse.io/blogs/architecture-autonomous-ai-agents-2026",
  og_title: "Autonomous AI Agents & Real-Time Intelligence 2026",
  og_description:
    "How multi-agent networks and streaming execution loops are transforming modern software development.",
  og_image: "/assets/img/featur-2.jpg",
  created_at: new Date().toISOString(),
};

const sampleClient: ClientItem = {
  id: 1,
  name: "TechSphere Insights",
  website_name: "TechSphere Official Blog",
  website_url: "https://techsphere.blogverse.io",
  domain: "techsphere.blogverse.io",
  logo: "",
  default_meta_title: "TechSphere Insights - Cutting-Edge Technology & Architecture",
  default_meta_description: "Deep dive articles on distributed systems, AI engineering, and modern web design.",
  status: 1,
};

export default function BlogPreview({ blogId, slug }: BlogPreviewProps) {
  const { token } = useAuth();
  const [blog, setBlog] = useState<BlogItem>(sampleBlog);
  const [client, setClient] = useState<ClientItem | null>(sampleClient);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeInspectorTab, setActiveInspectorTab] = useState<"seo" | "og" | "meta">("seo");
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(blogId || slug));

  useEffect(() => {
    if (!token && (blogId || slug)) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        let fetched: BlogItem | null = null;
        if (blogId) {
          fetched = await getBlogById(Number(blogId), token || "");
        } else if (slug) {
          fetched = await getBlogBySlug(slug, token || "");
        }

        if (fetched) {
          setBlog(fetched);
          if (fetched.client_id) {
            const clientData = await getClientById(fetched.client_id, token || "").catch(() => null);
            if (clientData) setClient(clientData);
          }
        }
      } catch (err) {
        console.error("Failed to load blog for admin preview:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [blogId, slug, token]);

  const publishFormattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Unpublished (Draft)";

  const isPublished =
    blog.status === 1 || blog.status === "1" || blog.status === "active" || blog.status === "Active";

  return (
    <div className="w-full pb-16">
      {/* Header & Controls Toolbar */}
      <div className="my-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
            <Link href="/admin/blogs" className="hover:text-purple-600 dark:hover:text-purple-400">
              Blogs
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200 font-medium">Article Preview</span>
            {blog.id && <span>(ID: #{blog.id})</span>}
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Blog Article Preview
            </h2>
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                isPublished
                  ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
              }`}
            >
              {isPublished ? "● Live / Published" : "○ Draft Mode"}
            </span>
          </div>
        </div>

        {/* Viewport Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Viewport Device Controls */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              title="Desktop View (100%)"
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewport === "desktop"
                  ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Desktop
            </button>

            <button
              type="button"
              onClick={() => setViewport("tablet")}
              title="Tablet View (768px)"
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewport === "tablet"
                  ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Tablet
            </button>

            <button
              type="button"
              onClick={() => setViewport("mobile")}
              title="Mobile View (390px)"
              className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewport === "mobile"
                  ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile
            </button>
          </div>

          {/* Action Buttons */}
          {blog.id && (
            <Link
              href={`/admin/blog/edit/${blog.id}`}
              className="flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-xs"
            >
              <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Article
            </Link>
          )}

          <Link
            href="/admin/blogs"
            className="px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            ← Back
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-16 text-gray-500 dark:text-gray-400">
          <svg className="w-8 h-8 mr-3 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-base font-medium">Loading blog preview...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Main Preview Container */}
          <div
            className={`transition-all duration-300 mx-auto ${
              viewport === "mobile"
                ? "xl:col-span-8 max-w-[390px] border-4 border-gray-800 dark:border-gray-700 rounded-3xl p-3 shadow-2xl bg-gray-900"
                : viewport === "tablet"
                ? "xl:col-span-8 max-w-[768px] border-4 border-gray-800 dark:border-gray-700 rounded-2xl p-4 shadow-xl bg-gray-900"
                : "xl:col-span-8 w-full"
            }`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Client & Publisher Header */}
              {client && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {client.logo ? (
                        <img src={getFullImageUrl(client.logo)} alt={client.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="font-bold text-xs text-purple-600 dark:text-purple-400">
                          {(client.name || "C").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{client.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{client.domain || client.website_url || "Client Portal"}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-[11px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 rounded-md">
                    Verified Publication
                  </span>
                </div>
              )}

              {/* Article Main Body */}
              <div className="p-6 md:p-8">
                {/* Meta Pills */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {publishFormattedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Editorial Staff
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    4 Min Read
                  </span>
                </div>

                {/* Article Title */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                  {blog.title || "Untitled Article"}
                </h1>

                {/* Excerpt */}
                {blog.excerpt && (
                  <p className="text-base font-medium text-gray-600 dark:text-gray-300 border-l-4 border-purple-500 pl-4 py-1 italic mb-6">
                    {blog.excerpt}
                  </p>
                )}

                {/* Featured Hero Image */}
                {blog.featured_image && (
                  <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-700 shadow-sm">
                    <img
                      src={getFullImageUrl(blog.featured_image)}
                      alt={blog.title || "Featured"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content Block */}
                <div
                  className="article-content text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      blog.content ||
                      `<p class="italic text-gray-400">No article content provided yet. Add rich text in the editor to see it rendered here.</p>`,
                  }}
                />

                {/* Article Tags & Sharing */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tags:
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                      #Architecture
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                      #Construction
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                      #Sustainability
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Share:</span>
                    <button type="button" className="p-1.5 text-gray-500 hover:text-blue-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </button>
                    <button type="button" className="p-1.5 text-gray-500 hover:text-blue-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Author Bio Box */}
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg flex-shrink-0">
                    MV
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Marcus Vance</h4>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Senior Architectural Correspondent</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Writing on regenerative urban systems, sustainable materials, and contemporary structural engineering.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector & Meta Preview Drawer */}
          <div className="xl:col-span-4 space-y-6">
            {/* Inspector Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 space-x-4">
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab("seo")}
                  className={`pb-1 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeInspectorTab === "seo"
                      ? "border-purple-600 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
                  }`}
                >
                  Google SERP
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab("og")}
                  className={`pb-1 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeInspectorTab === "og"
                      ? "border-purple-600 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
                  }`}
                >
                  Social Card
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab("meta")}
                  className={`pb-1 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeInspectorTab === "meta"
                      ? "border-purple-600 text-purple-600 dark:text-purple-400"
                      : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
                  }`}
                >
                  Details
                </button>
              </div>

              {/* Tab 1: Google SERP Preview */}
              {activeInspectorTab === "seo" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Live simulation of search engine listing on Google:
                  </p>
                  <div className="p-3.5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner font-sans">
                    <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">
                      <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[9px] font-bold">
                        G
                      </span>
                      <span className="truncate">
                        {blog.canonical_url || `https://${client?.domain || "example.com"}/blogs/${blog.slug || ""}`}
                      </span>
                    </div>
                    <h3 className="text-base text-blue-700 dark:text-blue-400 hover:underline font-medium line-clamp-1 cursor-pointer">
                      {blog.meta_title || blog.title || "Meta Title Not Configured"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 leading-normal">
                      {blog.meta_description || blog.excerpt || "No meta description provided. Search engines will automatically extract text from article content."}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: OpenGraph Social Card Preview */}
              {activeInspectorTab === "og" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Live simulation of social share preview card on Twitter / Facebook:
                  </p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="w-full h-36 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      {blog.og_image || blog.featured_image ? (
                        <img
                          src={getFullImageUrl(blog.og_image || blog.featured_image || "")}
                          alt="OG Card"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">
                          No OG Image Defined
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 truncate mb-0.5">
                        {client?.domain || "BLOGVERSE.IO"}
                      </p>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                        {blog.og_title || blog.meta_title || blog.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                        {blog.og_description || blog.meta_description || blog.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Detailed Metadata Table */}
              {activeInspectorTab === "meta" && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Article ID:</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">#{blog.id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Slug:</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 max-w-[160px] truncate">
                      /{blog.slug}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Client ID:</span>
                    <span className="text-gray-800 dark:text-gray-200">{client?.name || `ID #${blog.client_id || "Unassigned"}`}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {isPublished ? "Active / Published" : "Inactive / Draft"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500 dark:text-gray-400">Canonical:</span>
                    <span className="text-gray-800 dark:text-gray-200 max-w-[150px] truncate">
                      {blog.canonical_url || "Self"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-purple-600 text-white rounded-xl shadow-md p-5">
              <h4 className="font-bold text-base mb-1">Publishing Dashboard</h4>
              <p className="text-xs text-purple-100 mb-4">
                Make updates to content, optimize SEO tags, or link with client domains.
              </p>
              <div className="flex flex-col gap-2">
                {blog.id && (
                  <Link
                    href={`/admin/blog/edit/${blog.id}`}
                    className="w-full text-center py-2 px-3 bg-white text-purple-700 font-semibold text-xs rounded-lg hover:bg-purple-50 transition"
                  >
                    Edit This Post
                  </Link>
                )}
                <Link
                  href="/admin/blog/add"
                  className="w-full text-center py-2 px-3 bg-purple-700 text-white font-semibold text-xs rounded-lg hover:bg-purple-800 transition"
                >
                  Write Another Article
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
