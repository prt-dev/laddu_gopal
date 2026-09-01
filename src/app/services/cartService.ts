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

  // UI & LocalStorage convenience fields
  name?: string;
  img?: string;
  size?: string;
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

// ==========================================
// LOCALSTORAGE CART PERSISTENCE & HELPERS
// ==========================================

export const CART_STORAGE_KEY = "web_customer_cart";

/**
 * Get all cart items saved in localStorage
 */
export function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read cart from localStorage:", err);
    return [];
  }
}

/**
 * Save cart items to localStorage and trigger update event
 */
export function saveLocalCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart_updated"));
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
  }
}

/**
 * Add an item to localStorage cart (creates or increments quantity)
 */
export function addToLocalCart(item: Partial<CartItem>): CartItem[] {
  const current = getLocalCart();
  const prodId = item.product_id !== undefined ? item.product_id : item.id;
  const variant = item.variant || item.size || "Standard Size";
  const numPrice =
    typeof item.price === "number"
      ? item.price
      : parseFloat(String(item.price || 0).replace(/[^0-9.]/g, "")) || 0;
  const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;

  const existingIndex = current.findIndex((c) => {
    const matchId =
      c.product_id !== undefined && prodId !== undefined
        ? String(c.product_id) === String(prodId)
        : String(c.id) === String(item.id || prodId);
    const matchVariant = (c.variant || c.size || "") === variant;
    return matchId && matchVariant;
  });

  let updated: CartItem[];
  if (existingIndex > -1) {
    updated = current.map((c, idx) => {
      if (idx === existingIndex) {
        return {
          ...c,
          quantity: (c.quantity || 1) + qty,
          price: numPrice > 0 ? numPrice : c.price,
        };
      }
      return c;
    });
  } else {
    const newItem: CartItem = {
      id: item.id || prodId || Date.now(),
      product_id: prodId,
      name: item.name || item.product?.name || "Sacred Devotional Item",
      img:
        item.img ||
        item.product?.image_url ||
        item.product?.img ||
        "/assets/best-selling.png",
      variant: variant,
      size: variant,
      price: numPrice,
      quantity: qty,
      product: item.product,
    };
    updated = [...current, newItem];
  }

  saveLocalCart(updated);
  return updated;
}

/**
 * Update quantity of an item in localStorage
 */
export function updateLocalCartQuantity(
  id: number | string,
  deltaOrQty: number,
  variant?: string,
  isAbsolute: boolean = false
): CartItem[] {
  const current = getLocalCart();
  const updated = current
    .map((c) => {
      const matchId = String(c.id) === String(id) || String(c.product_id) === String(id);
      const matchVariant = variant !== undefined ? (c.variant || c.size || "") === variant : true;
      if (matchId && matchVariant) {
        const curQty = c.quantity || 1;
        const newQty = isAbsolute
          ? Math.max(1, deltaOrQty)
          : Math.max(1, curQty + deltaOrQty);
        return { ...c, quantity: newQty };
      }
      return c;
    })
    .filter((c) => (c.quantity || 0) > 0);

  saveLocalCart(updated);
  return updated;
}

/**
 * Remove an item from localStorage
 */
export function removeLocalCartItem(
  id: number | string,
  variant?: string
): CartItem[] {
  const current = getLocalCart();
  const updated = current.filter((c) => {
    const matchId = String(c.id) === String(id) || String(c.product_id) === String(id);
    const matchVariant = variant !== undefined ? (c.variant || c.size || "") === variant : true;
    return !(matchId && matchVariant);
  });

  saveLocalCart(updated);
  return updated;
}

/**
 * Clear all cart items from localStorage
 */
export function clearLocalCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new Event("cart_updated"));
  } catch (err) {
    console.error("Failed to clear local cart:", err);
  }
}

/**
 * Calculate total quantity of all items in cart
 */
export function getCartCount(items?: CartItem[]): number {
  const list = items || getLocalCart();
  return list.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}

/**
 * Calculate total subtotal amount of all items in cart
 */
export function getCartSubtotal(items?: CartItem[]): number {
  const list = items || getLocalCart();
  return list.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
}

