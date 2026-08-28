import { BASE_URL } from "@/app/services/authService";
import { ProductItem } from "@/app/services/productService";

export interface CartItem {
  id?: number | string;
  user_id?: number | string;
  product_id?: number | string;
  variant?: string; // variant is size of product (e.g. "Size 4", "Size 0", "Size M / Black")
  quantity?: number;
  price?: number | string;
  product?: ProductItem;
  created_at?: string;
  updated_at?: string;
}

export interface GetCartParams {
  page?: number;
  limit?: number;
  search?: string;
  user_id?: number | string;
  product_id?: number | string;
}

/**
 * 1. Create Cart Item / Add to Cart
 * Endpoint: POST /api/v1/carts/create
 */
export async function addToCartApi(
  data: Partial<CartItem>,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/carts/create`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to create cart item"
    );
  }

  return response.json();
}


/**
 * 2. Get My Cart (current authenticated user's cart)
 * Endpoint: GET /api/v1/carts/my-cart
 */
export async function getMyCartApi(token: string) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/carts/my-cart`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch user cart"
    );
  }

  return response.json();
}

/**
 * 3. Get All Cart Items (Paginated / Filtered)
 * Endpoint: GET /api/v1/carts/all?page=1&limit=10&search=&user_id=&product_id=
 */
export async function getAllCartsApi(
  { page = 1, limit = 10, search = "", user_id, product_id }: GetCartParams = {},
  token?: string
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search?.trim()) {
    params.append("search", search.trim());
  }
  if (user_id !== undefined && user_id !== null && user_id !== "") {
    params.append("user_id", user_id.toString());
  }
  if (product_id !== undefined && product_id !== null && product_id !== "") {
    params.append("product_id", product_id.toString());
  }

  const url = `${BASE_URL}/carts/all?${params.toString()}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch cart items"
    );
  }

  return response.json();
}

/**
 * 4. Get Single Cart Item by ID
 * Endpoint: GET /api/v1/carts/{cart_id}
 */
export async function getCartItemById(
  cartId: number | string,
  token?: string
) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/carts/${cartId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch cart item"
    );
  }

  return response.json();
}

/**
 * 5. Update Cart Item
 * Endpoint: PUT /api/v1/carts/{cart_id}
 */
export async function updateCartItemApi(
  cartId: number | string,
  data: Partial<CartItem>,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/carts/${cartId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to update cart item"
    );
  }

  return response.json();
}

/**
 * 6. Delete Single Cart Item
 * Endpoint: DELETE /api/v1/carts/{cart_id}
 */
export async function deleteCartItemApi(
  cartId: number | string,
  token?: string
) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/carts/${cartId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to delete cart item"
    );
  }

  return response.json();
}

/**
 * 7. Clear My Cart
 * Endpoint: DELETE /api/v1/carts/clear
 */
export async function clearMyCartApi(token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/carts/clear`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to clear cart"
    );
  }

  return response.json();
}
