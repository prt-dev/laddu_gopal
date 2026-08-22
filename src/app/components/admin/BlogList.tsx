"use client";

import React, { useEffect, useState } from "react";
import BlogTable from "@/app/components/admin/BlogTable";
import { BlogItem, getBlogs, deleteBlogApi } from "@/app/services/blogService";
import { ClientItem, getClients } from "@/app/services/clientService";
import { useAuth } from "@/app/context/AuthContext";

export default function BlogList() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const [blogsList, setBlogsList] = useState<BlogItem[]>([]);
  const [clientsList, setClientsList] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlogs = async (authToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const [blogsData, clientsData] = await Promise.all([
        getBlogs({}, authToken),
        getClients({ limit: 100 }, authToken).catch(() => ({ clients: [] })),
      ]);

      if (Array.isArray(blogsData)) {
        setBlogsList(blogsData);
      } else if (blogsData?.items && Array.isArray(blogsData.items)) {
        setBlogsList(blogsData.items);
      } else if (blogsData?.blogs && Array.isArray(blogsData.blogs)) {
        setBlogsList(blogsData.blogs);
      } else {
        setBlogsList([]);
      }

      if (clientsData?.clients && Array.isArray(clientsData.clients)) {
        setClientsList(clientsData.clients);
      }
    } catch (err: any) {
      console.error("Failed to load blogs:", err);
      setError(err?.message || "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadBlogs(token);
    } else if (!isAuthLoading && !token) {
      setIsLoading(false);
    }
  }, [token, isAuthLoading]);

  const handleDelete = async (blog: BlogItem) => {
    if (!blog.id || !token) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete blog "${blog.title}"?`
    );
    if (!confirmed) return;

    try {
      await deleteBlogApi(blog.id, token);
      await loadBlogs(token);
    } catch (err: any) {
      alert(err?.message || "Failed to delete blog post.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <svg
          className="w-6 h-6 mr-3 animate-spin text-purple-600"
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
        <span>Loading blogs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  return <BlogTable data={blogsList} clients={clientsList} onDelete={handleDelete} />;
}
