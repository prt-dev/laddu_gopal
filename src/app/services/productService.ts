import { BASE_URL } from "@/app/services/authService";

export interface ProductItem {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock_quantity?: number;
  category_id?: number;
  image_url?: string;
  status?: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: number;
}

export async function getProducts(
  { page = 1, limit = 10, search = "", category_id, status }: GetProductsParams = {},
  token: string
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search?.trim()) {
    params.append("search", search.trim());
  }
  if (category_id !== undefined && category_id !== null) {
    params.append("category_id", category_id.toString());
  }
  if (status !== undefined && status !== null) {
    params.append("status", status.toString());
  }

  const url = `${BASE_URL}/products/all?${params.toString()}`;

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
      errorData.detail || errorData.message || "Failed to fetch products"
    );
  }

  return response.json();
}

export async function getProductById(productId: number, token: string) {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch product"
    );
  }

  return response.json();
}

export async function createProductApi(data: Partial<ProductItem>, token: string) {
  const response = await fetch(`${BASE_URL}/products/create`, {
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
      errorData.detail || errorData.message || "Failed to create product"
    );
  }

  return response.json();
}

export async function updateProductApi(
  productId: number,
  data: Partial<ProductItem>,
  token: string
) {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
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
      errorData.detail || errorData.message || "Failed to update product"
    );
  }

  return response.json();
}

export async function deleteProductApi(productId: number, token: string) {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to delete product"
    );
  }

  return response.json();
}
