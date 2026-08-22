"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  createBlogApi,
  updateBlogApi,
  getBlogById,
  BlogItem,
} from "@/app/services/blogService";
import { getClients, ClientItem } from "@/app/services/clientService";
import { BASE_URL } from "@/app/services/authService";
import { getFullImageUrl } from "@/app/utils/utils";

interface BlogFormProps {
  blogId?: number | string;
  mode?: "add" | "edit";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogForm({ blogId, mode }: BlogFormProps) {
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth();
  const featuredImageInputRef = useRef<HTMLInputElement | null>(null);
  const ogImageInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = mode === "edit" || Boolean(blogId);

  const [clients, setClients] = useState<ClientItem[]>([]);
  const [formData, setFormData] = useState({
    client_id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    status: 1,
    published_at: new Date().toISOString().slice(0, 16),
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image: "",
  });

  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [selectedFeaturedFile, setSelectedFeaturedFile] = useState<File | null>(null);
  const [featuredPreviewUrl, setFeaturedPreviewUrl] = useState<string>("");
  const [selectedOgFile, setSelectedOgFile] = useState<File | null>(null);
  const [ogPreviewUrl, setOgPreviewUrl] = useState<string>("");

  const [isFetching, setIsFetching] = useState<boolean>(isEdit);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Load clients for selector
  useEffect(() => {
    if (!token) return;
    getClients({ limit: 100 }, token)
      .then((res) => {
        if (res?.clients) setClients(res.clients);
      })
      .catch((err) => console.error("Failed to load clients list", err));
  }, [token]);

  // Fetch existing blog data in edit mode
  useEffect(() => {
    if (!isEdit || !blogId || !token) return;

    const fetchBlog = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const data = await getBlogById(Number(blogId), token);
        if (data) {
          setFormData({
            client_id: data.client_id !== undefined && data.client_id !== null ? String(data.client_id) : "",
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            featured_image: data.featured_image || "",
            status:
              data.status === 1 ||
              data.status === "1" ||
              data.status === "active" ||
              data.status === "Active"
                ? 1
                : 0,
            published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : "",
            meta_title: data.meta_title || "",
            meta_description: data.meta_description || "",
            canonical_url: data.canonical_url || "",
            og_title: data.og_title || "",
            og_description: data.og_description || "",
            og_image: data.og_image || "",
          });

          if (data.featured_image) {
            setFeaturedPreviewUrl(getFullImageUrl(data.featured_image));
          }
          if (data.og_image) {
            setOgPreviewUrl(getFullImageUrl(data.og_image));
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch blog:", err);
        setError(err?.message || "Failed to load blog details.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchBlog();
  }, [isEdit, blogId, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" && !isEdit && (!prev.slug || prev.slug === slugify(prev.title))) {
        updated.slug = slugify(value);
      }
      return updated;
    });

    if (name === "featured_image") {
      setFeaturedPreviewUrl(getFullImageUrl(value));
    }
    if (name === "og_image") {
      setOgPreviewUrl(getFullImageUrl(value));
    }
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === 1 ? 0 : 1,
    }));
  };

  const handleFeaturedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSelectedFeaturedFile(file);
    setFeaturedPreviewUrl(URL.createObjectURL(file));
  };

  const handleOgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSelectedOgFile(file);
    setOgPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImageToServer = async (file: File, authToken: string): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const uploadUrl = `${BASE_URL}/upload/image?folder=blogs`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || "Failed to upload image.");
    }

    const result = await response.json();
    return result.image_url || result.file_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Blog title is required.");
      return;
    }

    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let finalFeaturedImageUrl = formData.featured_image.trim();
      let finalOgImageUrl = formData.og_image.trim();

      if (selectedFeaturedFile) {
        setUploadProgress("Uploading featured image...");
        finalFeaturedImageUrl = await uploadImageToServer(selectedFeaturedFile, token);
      }

      if (selectedOgFile) {
        setUploadProgress("Uploading OG image...");
        finalOgImageUrl = await uploadImageToServer(selectedOgFile, token);
      }

      setUploadProgress(isEdit ? "Updating blog..." : "Publishing blog...");

      const payload: Partial<BlogItem> = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || slugify(formData.title),
        client_id: formData.client_id ? Number(formData.client_id) : undefined,
        excerpt: formData.excerpt.trim() || undefined,
        content: formData.content.trim() || undefined,
        featured_image: finalFeaturedImageUrl || undefined,
        status: formData.status,
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : undefined,
        meta_title: formData.meta_title.trim() || undefined,
        meta_description: formData.meta_description.trim() || undefined,
        canonical_url: formData.canonical_url.trim() || undefined,
        og_title: formData.og_title.trim() || undefined,
        og_description: formData.og_description.trim() || undefined,
        og_image: finalOgImageUrl || undefined,
      };

      if (isEdit && blogId) {
        await updateBlogApi(Number(blogId), payload, token);
      } else {
        await createBlogApi(payload, token);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/blogs");
      }, 1200);
    } catch (err: any) {
      console.error(isEdit ? "Failed to update blog:" : "Failed to create blog:", err);
      setError(
        err?.message ||
        (isEdit ? "Failed to update blog." : "Failed to create blog.")
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  if (isFetching) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 flex items-center justify-center p-12 text-gray-500 dark:text-gray-400">
        <svg
          className="w-8 h-8 mr-3 animate-spin text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-base font-medium">Loading blog details...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      {/* Header & Breadcrumbs */}
      <div className="flex items-center justify-between my-6">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link
              href="/admin/blogs"
              className="hover:text-purple-600 dark:hover:text-purple-400"
            >
              Blogs
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-200">
              {isEdit ? "Edit Article" : "Write New"}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {isEdit ? "Edit Blog Article" : "Create New Blog Article"}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          {isEdit && blogId && (
            <Link
              href={`/admin/blog/preview/${blogId}`}
              className="flex items-center px-3 py-2 text-sm font-medium leading-5 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 focus:outline-none transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Admin Preview ↗
            </Link>
          )}
          <Link
            href="/admin/blogs"
            className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300 flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 font-bold ml-2 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-300 flex items-center">
          <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            {isEdit
              ? "Blog updated successfully! Redirecting to blogs list..."
              : "Blog published successfully! Redirecting to blogs list..."}
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 space-x-6">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === "content"
            ? "border-purple-600 text-purple-600 dark:text-purple-400"
            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
        >
          1. Article Content & Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === "seo"
            ? "border-purple-600 text-purple-600 dark:text-purple-400"
            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
        >
          2. SEO & Social Meta (OpenGraph)
        </button>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="px-6 py-6 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-6"
      >
        {activeTab === "content" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Article Title <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Modern Architecture Trends for 2026"
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            {/* URL Slug */}
            <div>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  URL Slug <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="modern-architecture-trends-for-2026"
                  className="block w-full mt-1 text-sm font-mono dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            {/* Client Selector */}
            <div>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Client / Brand
                </span>
                <select
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-select py-2.5 px-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select a Client (Optional)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.domain ? `(${c.domain})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Featured Image */}
            <div className="md:col-span-2">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Featured Image
                </span>
              </label>
              <div
                onClick={() => featuredImageInputRef.current?.click()}
                className="mt-1 flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 bg-gray-50 dark:bg-gray-700/40 transition-colors"
              >
                <svg className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-purple-600 dark:text-purple-400 underline">Click to choose image</span> or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP, SVG (Max 10MB)</p>
                <input
                  ref={featuredImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedFileChange}
                  className="hidden"
                />
              </div>

              {featuredPreviewUrl && (
                <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                      <img src={featuredPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {selectedFeaturedFile ? selectedFeaturedFile.name : "Featured Image"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedFeaturedFile ? `${(selectedFeaturedFile.size / 1024).toFixed(1)} KB` : formData.featured_image}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFeaturedFile(null);
                      setFeaturedPreviewUrl("");
                      setFormData((p) => ({ ...p, featured_image: "" }));
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-900/30 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Excerpt
                </span>
                <textarea
                  name="excerpt"
                  rows={2}
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Short overview / teaser of the blog article..."
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Content
                </span>
                <textarea
                  name="content"
                  rows={8}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Full article content..."
                  className="block w-full mt-1 text-sm font-mono dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Status
                </span>
                <div className="flex items-center space-x-3 mt-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.status === 1}
                    onClick={handleStatusToggle}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.status === 1
                      ? "bg-purple-600 dark:bg-purple-500"
                      : "bg-gray-200 dark:bg-gray-700"
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.status === 1 ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formData.status === 1 ? "Published" : "Draft"}
                  </span>
                </div>
              </label>
            </div>

            {/* Published At */}
            <div>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Published Date & Time
                </span>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleChange}
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>
          </div>
        ) : (
          /* TAB 2: SEO & SOCIAL META */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Meta Title
                </span>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  placeholder="Custom SEO Title"
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Canonical URL
                </span>
                <input
                  type="url"
                  name="canonical_url"
                  value={formData.canonical_url}
                  onChange={handleChange}
                  placeholder="https://example.com/blogs/..."
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  Meta Description
                </span>
                <textarea
                  name="meta_description"
                  rows={3}
                  value={formData.meta_description}
                  onChange={handleChange}
                  placeholder="Search engine meta description snippet..."
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                OpenGraph / Social Media Cards
              </h4>
            </div>

            <div>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  OG Title
                </span>
                <input
                  type="text"
                  name="og_title"
                  value={formData.og_title}
                  onChange={handleChange}
                  placeholder="OpenGraph sharing title"
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  OG Image
                </span>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    name="og_image"
                    value={formData.og_image}
                    onChange={handleChange}
                    placeholder="OG Image URL"
                    className="block flex-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                  />
                  <input
                    ref={ogImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleOgFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => ogImageInputRef.current?.click()}
                    className="px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 border border-gray-300 dark:border-gray-600"
                  >
                    Upload
                  </button>
                </div>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400 font-medium">
                  OG Description
                </span>
                <textarea
                  name="og_description"
                  rows={2}
                  value={formData.og_description}
                  onChange={handleChange}
                  placeholder="OpenGraph sharing description..."
                  className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2.5 px-3 border border-gray-300 rounded-md"
                />
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            {activeTab === "content" ? (
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Next: SEO & Social Settings →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                ← Back to Content
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin/blogs"
              className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="flex items-center px-5 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isSubmitting
                ? uploadProgress || (isEdit ? "Updating Blog..." : "Publishing Blog...")
                : isEdit
                  ? "Update Blog"
                  : "Publish Blog"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
