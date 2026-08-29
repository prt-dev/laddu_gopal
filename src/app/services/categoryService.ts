import { BASE_URL } from "@/app/services/authService";
import localCategories from "@/app/data/categories.json";

export interface CategoryItem {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  parent_id?: number | null;
  status?: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  parent_id?: number;
  status?: number;
}

export interface GetCategoriesResponse {
  total: number;
  categories: CategoryItem[];
  items: CategoryItem[];
}

function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    localStorage.getItem("admin_token") ||
    localStorage.getItem("web_customer_token") ||
    undefined
  );
}

/**
 * Fetch all categories with optional search, pagination, and status filters with fallback
 */
export async function getCategories(
  { page = 1, limit = 50, search = "", parent_id, status }: GetCategoriesParams = {},
  token?: string
): Promise<GetCategoriesResponse> {
  const authToken = token || getStoredToken();
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search?.trim()) {
    params.append("search", search.trim());
  }
  if (parent_id !== undefined && parent_id !== null) {
    params.append("parent_id", parent_id.toString());
  }
  if (status !== undefined && status !== null) {
    params.append("status", status.toString());
  }

  const url = `${BASE_URL}/categories/all?${params.toString()}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories from API");
    }

    const data = await response.json();
    const rawCategories: CategoryItem[] = data.categories || data.items || data.data || (Array.isArray(data) ? data : []);

    return {
      total: data.total ?? rawCategories.length,
      categories: rawCategories,
      items: rawCategories,
    };
  } catch (err) {
    console.warn("getCategories fallback to local categories:", err);
    let fallback = [...localCategories] as CategoryItem[];
    if (search?.trim()) {
      const q = search.toLowerCase().trim();
      fallback = fallback.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    return {
      total: fallback.length,
      categories: fallback,
      items: fallback,
    };
  }
}

/**
 * Fetch single category by ID
 */
export async function getCategoryById(categoryId: number, token?: string): Promise<CategoryItem> {
  const authToken = token || getStoredToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category ${categoryId}`);
    }

    return await response.json();
  } catch (err) {
    const found = localCategories.find((c) => c.id === categoryId) || localCategories[0];
    return found as CategoryItem;
  }
}

/**
 * Fetch single category by slug
 */
export async function getCategoryBySlug(slug: string, token?: string): Promise<CategoryItem> {
  const authToken = token || getStoredToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${BASE_URL}/categories/slug/${encodeURIComponent(slug)}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category by slug ${slug}`);
    }

    return await response.json();
  } catch (err) {
    const found = localCategories.find((c) => c.slug === slug) || localCategories[0];
    return found as CategoryItem;
  }
}

/**
 * Create a new category
 */
export async function createCategoryApi(data: Partial<CategoryItem>, token: string) {
  const response = await fetch(`${BASE_URL}/categories/create`, {
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
      errorData.detail || errorData.message || "Failed to create category"
    );
  }

  return response.json();
}

/**
 * Update an existing category
 */
export async function updateCategoryApi(
  categoryId: number,
  data: Partial<CategoryItem>,
  token: string
) {
  const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
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
      errorData.detail || errorData.message || "Failed to update category"
    );
  }

  return response.json();
}

/**
 * Delete a category
 */
export async function deleteCategoryApi(categoryId: number, token: string) {
  const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to delete category"
    );
  }

  return response.json();
}
