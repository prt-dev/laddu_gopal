import { BASE_URL } from "@/app/services/authService";

export interface BlogItem {
  id?: number;
  client_id?: number;
  author_id?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  status?: number | string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  client_id?: number;
  author_id?: number;
  status?: number;
}

export async function getBlogs(
  { page = 1, limit = 10, search = "", client_id, author_id, status }: GetBlogsParams = {},
  token: string
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search?.trim()) {
    params.append("search", search.trim());
  }
  if (client_id !== undefined && client_id !== null) {
    params.append("client_id", client_id.toString());
  }
  if (author_id !== undefined && author_id !== null) {
    params.append("author_id", author_id.toString());
  }
  if (status !== undefined && status !== null) {
    params.append("status", status.toString());
  }

  const url = `${BASE_URL}/blogs/all?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch blogs"
    );
  }

  return response.json();
}

export async function getBlogById(blogId: number, token: string) {
  const response = await fetch(`${BASE_URL}/blogs/${blogId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch blog"
    );
  }

  return response.json();
}

export async function getBlogBySlug(slug: string, token: string) {
  const response = await fetch(`${BASE_URL}/blogs/slug/${encodeURIComponent(slug)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch blog"
    );
  }

  return response.json();
}

export async function createBlogApi(data: Partial<BlogItem>, token: string) {
  const response = await fetch(`${BASE_URL}/blogs/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to create blog"
    );
  }

  return response.json();
}

export async function updateBlogApi(
  blogId: number,
  data: Partial<BlogItem>,
  token: string
) {
  const response = await fetch(`${BASE_URL}/blogs/${blogId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to update blog"
    );
  }

  return response.json();
}

export async function deleteBlogApi(blogId: number, token: string) {
  const response = await fetch(`${BASE_URL}/blogs/${blogId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to delete blog"
    );
  }

  return response.json();
}
