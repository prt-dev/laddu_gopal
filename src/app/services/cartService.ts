import { BASE_URL } from "@/app/services/authService";
import { ProductItem } from "@/app/services/productService";

export const CART_STATUS = {
  FAILED: 0,
  PENDING: 1,
  COMPLETED: 2,
} as const;

export type CartStatus = (typeof CART_STATUS)[keyof typeof CART_STATUS];


export interface CartItem extends Omit<ProductItem, "id" | "variant" | "price" | "status" | "created_at" | "updated_at"> {
  product_id?: number | string;
  variant?: string; // variant is size/variation of product (e.g. "Size 4", "Size 0")
  quantity?: number;
  price?: number | string;
}

export interface GetCartParams {
  page?: number;
  limit?: number;
  search?: string;
  user_id?: number | string;
  product_id?: number | string;
}

export const ACTIVE_CART_ID_KEY = "active_cart_id";
export const CART_ID_KEY = "active_cart_id"; // Backward compatibility alias

/**
 * Safely parse and sanitize price values into clean numbers
 */
export function parseItemPrice(price?: number | string | null): number {
  if (typeof price === "number") return isNaN(price) ? 0 : price;
  if (!price) return 0;
  const cleaned = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  return isNaN(cleaned) ? 0 : cleaned;
}

/**
 * Normalizes any partial cart/product object into a consistent CartItem
 */
export function normalizeCartItem(item: Partial<CartItem> & { [key: string]: any }): CartItem {
  const prodId = item.product_id !== undefined ? item.product_id : item.id;
  const variant = item.variant || item.size || "Standard Size";
  const numPrice = parseItemPrice(item.price);
  const qty = item.quantity && Number(item.quantity) > 0 ? Number(item.quantity) : 1;
  const image =
    item.image_url ||
    item.img ||
    "/assets/best-selling.png";

  const normalized: CartItem = {
    ...item,
    product_id: prodId,
    variant: String(variant),
    price: numPrice,
    quantity: qty,
    name: item.name || "Sacred Devotional Item",
    description: item.description || "",
    sku: item.sku,
    stock_quantity: item.stock_quantity,
    category_id: item.category_id,
    category: item.category,
    image_url: image,
    img: image,
  };
  delete (normalized as any).id;
  delete (normalized as any).size;
  delete (normalized as any).product;
  delete (normalized as any).products;
  delete (normalized as any).status;
  return normalized;
}

/**
 * Safely unpacks cart items from varied backend response structures
 */
export function extractBackendCartItems(cartData: any): CartItem[] {
  if (!cartData) return [];
  if (Array.isArray(cartData)) return cartData.map(normalizeCartItem);

  const rawList = cartData.cartitems !== undefined ? cartData.cartitems : cartData.products;
  if (rawList) {
    try {
      const parsed = typeof rawList === "string" ? JSON.parse(rawList) : rawList;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeCartItem);
      }
    } catch (e) {
      console.warn("Could not parse cartitems JSON from cart:", e);
    }
  }

  if (Array.isArray(cartData.items)) return cartData.items.map(normalizeCartItem);
  if (Array.isArray(cartData.carts)) return cartData.carts.map(normalizeCartItem);
  if (cartData.product_id || cartData.id) return [normalizeCartItem(cartData)];

  return [];
}

/**
 * Get stored cart_id from localStorage
 */
export function getStoredCartId(): number | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const val = localStorage.getItem(ACTIVE_CART_ID_KEY) || localStorage.getItem("cart_id");
    if (val && !isNaN(Number(val))) {
      return Number(val);
    }
  } catch { }
  return undefined;
}

export function setStoredCartId(cartId: number | string): void {
  if (typeof window === "undefined") return;
  try {
    const numId = Number(cartId);
    if (!isNaN(numId)) {
      localStorage.setItem(ACTIVE_CART_ID_KEY, String(numId));
      window.dispatchEvent(new Event("cart_updated"));
      window.dispatchEvent(new CustomEvent("cart_id_updated", { detail: numId }));
    }
  } catch { }
}

export function removeStoredCartId(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_CART_ID_KEY);
    localStorage.removeItem("cart_id");
    window.dispatchEvent(new Event("cart_updated"));
    window.dispatchEvent(new CustomEvent("cart_id_updated", { detail: undefined }));
  } catch { }
}

// ==========================================
// INTERNAL HELPERS (DRY)
// ==========================================

/**
 * Generate standard API request headers
 */
function getApiHeaders(token?: string, contentType = "application/json"): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Common fetch response handler
 */
async function handleApiResponse(response: Response, defaultErrorMsg: string) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: any = new Error(errorData.detail || errorData.message || defaultErrorMsg);
    error.status = response.status;
    throw error;
  }
  return response.json();
}


export function formatCartPayload(data: {
  products?: any;
  user_id?: number | string;
  price?: number | string;
  status?: number | string;
}): { products: string; user_id: number; price: number; status: number } {
  const rawProducts = data.products;
  let productsJson: string;

  if (typeof rawProducts === "string") {
    productsJson = rawProducts;
  } else if (Array.isArray(rawProducts)) {
    const formatted = rawProducts.map((it: any) => ({
      product_id: it.product_id !== undefined ? it.product_id : it.id,
      variant: it.variant || "Standard Size",
      quantity: Math.max(1, Number(it.quantity) || 1),
      price: Number(it.price) || 0,
    }));
    productsJson = JSON.stringify(formatted);
  } else if (rawProducts && typeof rawProducts === "object") {
    productsJson = JSON.stringify([rawProducts]);
  } else {
    productsJson = "[]";
  }

  return {
    products: productsJson,
    user_id: Number(data.user_id),
    price: Number(data.price || 0),
    status: data.status !== undefined && data.status !== null ? Number(data.status) : CART_STATUS.PENDING,
  };
}

/**
 * Extract numeric cart ID from API response
 */
export function extractCartId(res: any): number | undefined {
  const id =
    res?.id !== undefined
      ? res.id
      : res?.cart_id !== undefined
        ? res.cart_id
        : res?.data?.id;
  if (id !== undefined && id !== null && !isNaN(Number(id))) {
    return Number(id);
  }
  return undefined;
}

// ==========================================
// CART API ENDPOINTS
// ==========================================

/**
 * 4. Get Latest Cart by User ID where status is pending (1)
 * Endpoint: GET /api/v1/carts/latest/{user_id}?status=1
 */
export async function getLatestCartByUserId(
  userId: number | string,
  token?: string | null,
  status: number = CART_STATUS.PENDING
): Promise<any> {
  try {
    const url = `${BASE_URL}/carts/latest/${userId}?status=${status}`;
    const response = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(token || undefined, ""),
    });
    if (!response.ok) return null;
    return response.json();
  } catch (err) {
    console.warn("Could not get latest cart by user_id:", err);
    return null;
  }
}

/**
 * 1. Create Cart Item / Add to Cart
 * Endpoint: POST /api/v1/carts/create
 * Sends ONLY:
 * - json data of cartitems (products)
 * - user id (user_id)
 * - total amount as price (price)
 * where each cartitem contains product_id, variant, quantity
 */
export async function addToCartApi(
  data: { products?: any; user_id?: number | string; price?: number | string; status?: number | string;[key: string]: any },
  token?: string
) {
  const payload = formatCartPayload(data);
  const response = await fetch(`${BASE_URL}/carts/create`, {
    method: "POST",
    headers: getApiHeaders(token),
    body: JSON.stringify(payload),
  });

  const result = await handleApiResponse(response, "Failed to create cart item");
  const createdId = extractCartId(result);
  if (createdId) {
    setStoredCartId(createdId);
  }
  return result;
}

/**
 * 6. Update Cart Item
 * Endpoint: PUT /api/v1/carts/{cart_id}
 * Sends ONLY:
 * - json data of cartitems (products)
 * - user id (user_id)
 * - total amount as price (price)
 * where each cartitem contains product_id, variant, quantity
 */
export async function updateCartItemApi(
  cartId: number | string,
  data: { products?: any; user_id?: number | string; price?: number | string; status?: number | string;[key: string]: any },
  token?: string
) {
  const payload = formatCartPayload(data);
  const response = await fetch(`${BASE_URL}/carts/${cartId}`, {
    method: "PUT",
    headers: getApiHeaders(token),
    body: JSON.stringify(payload),
  });

  const result = await handleApiResponse(response, "Failed to update cart item");
  const updatedId = extractCartId(result) || (Number(cartId) < 100000000000 ? Number(cartId) : undefined);
  if (updatedId) {
    setStoredCartId(updatedId);
  }
  return result;
}

/**
 * 7. Create or Update Cart
 * If cart_id or id is provided, updates via PUT /api/v1/carts/{cart_id}
 * Otherwise creates via POST /api/v1/carts/create
 * Automatically sets cartId on success
 */
export async function createOrUpdateCartApi(
  data: {
    cart_id?: number | string;
    id?: number | string;
    products?: any;
    user_id?: number | string;
    price?: number | string;
    status?: number | string;
    [key: string]: any;
  },
  token?: string | null
): Promise<any> {
  const targetCartId = data.cart_id || data.id;

  if (targetCartId && !isNaN(Number(targetCartId)) && Number(targetCartId) < 100000000000) {
    try {
      return await updateCartItemApi(targetCartId, data, token || undefined);
    } catch (err: any) {
      const isNotFound =
        err?.status === 404 ||
        err?.message === "Cart item not found" ||
        err?.message?.includes("Cart item not found");

      if (isNotFound) {
        console.warn("Cart item not found on server (404), falling back to create cart:", err);
        removeStoredCartId();
        return await addToCartApi(data, token || undefined);
      }

      console.warn("Update cart item failed:", err);
      return null;
    }
  }

  return await addToCartApi(data, token || undefined);
}

/**
 * 8. Sync Entire Cart Items List to Server
 * Calculates total amount, formats products with product_id, variant, and quantity,
 * and sends only required fields to create or update cart on server.
 */
export async function syncCartToServer(
  items: CartItem[],
  userId?: number | string,
  cartId?: number | string,
  token?: string | null
): Promise<any> {
  if (!userId || isNaN(Number(userId))) return null;
  const numPrice = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );
  return createOrUpdateCartApi(
    {
      cart_id: cartId,
      products: items,
      user_id: Number(userId),
      price: Number(numPrice.toFixed(2)),
    },
    token || null
  );
}

/**
 * 10. Update Cart Status
 * 0 = failed, 1 = pending, 2 = completed
 * Endpoint: PUT /api/v1/carts/{cart_id}
 */
export async function updateCartStatusApi(
  cartId: number | string,
  status: 0 | 1 | 2 | number,
  token?: string
) {
  if (!cartId || isNaN(Number(cartId)) || Number(cartId) >= 100000000000) return null;
  try {
    return await updateCartItemApi(cartId, { status }, token);
  } catch (err) {
    console.warn(`Failed to update cart ${cartId} status to ${status}:`, err);
    return null;
  }
}

// Non using api functions start //
/**
 * 9. Delete Single Cart Item
 * Endpoint: DELETE /api/v1/carts/{cart_id}
 */
export async function deleteCartItemApi(
  cartId: number | string,
  token?: string
) {
  const response = await fetch(`${BASE_URL}/carts/${cartId}`, {
    method: "DELETE",
    headers: getApiHeaders(token, ""),
  });
  return handleApiResponse(response, "Failed to delete cart item");
}

/**
 * 2. Get My Cart (current authenticated user's cart)
 * Endpoint: GET /api/v1/carts/my-cart
 */
export async function getMyCartApi(token: string) {
  const response = await fetch(`${BASE_URL}/carts/my-cart`, {
    method: "GET",
    headers: getApiHeaders(token, ""),
  });
  return handleApiResponse(response, "Failed to fetch user cart");
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

  if (search?.trim()) params.append("search", search.trim());
  if (user_id !== undefined && user_id !== null && user_id !== "") params.append("user_id", user_id.toString());
  if (product_id !== undefined && product_id !== null && product_id !== "") params.append("product_id", product_id.toString());

  const response = await fetch(`${BASE_URL}/carts/all?${params.toString()}`, {
    method: "GET",
    headers: getApiHeaders(token),
  });
  return handleApiResponse(response, "Failed to fetch cart items");
}


/**
 * 5. Get Single Cart Item by ID
 * Endpoint: GET /api/v1/carts/{cart_id}
 */
export async function getCartItemById(
  cartId: number | string,
  token?: string
) {
  const response = await fetch(`${BASE_URL}/carts/${cartId}`, {
    method: "GET",
    headers: getApiHeaders(token, ""),
  });
  return handleApiResponse(response, "Failed to fetch cart item");
}

/**
 * 9. Clear My Cart
 * Endpoint: DELETE /api/v1/carts/clear
 */
export async function clearMyCartApi(token?: string) {
  const response = await fetch(`${BASE_URL}/carts/clear`, {
    method: "DELETE",
    headers: getApiHeaders(token, ""),
  });
  const result = await handleApiResponse(response, "Failed to clear cart");
  removeStoredCartId();
  return result;
}

// Non using api functions end //

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
  const normalized = normalizeCartItem(item);

  const existingIndex = current.findIndex(
    (c) => String(c.product_id) === String(normalized.product_id) && (c.variant || "") === (normalized.variant || "")
  );

  let updated: CartItem[];
  if (existingIndex > -1) {
    updated = current.map((c, idx) => {
      if (idx === existingIndex) {
        return {
          ...c,
          ...normalized,
          quantity: (c.quantity || 1) + (normalized.quantity || 1),
          price: normalized.price ? normalized.price : c.price,
        };
      }
      return c;
    });
  } else {
    updated = [...current, normalized];
  }

  saveLocalCart(updated);
  return updated;
}

/**
 * Update quantity of an item in localStorage
 */
export function updateLocalCartQuantity(
  productId: number | string,
  deltaOrQty: number,
  variant?: string,
  isAbsolute: boolean = false
): CartItem[] {
  const current = getLocalCart();
  const updated = current
    .map((c) => {
      const matchId = String(c.product_id) === String(productId);
      const matchVariant = variant !== undefined ? (c.variant || "") === variant : true;
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
  productId: number | string,
  variant?: string
): CartItem[] {
  const current = getLocalCart();
  const updated = current.filter((c) => {
    const matchId = String(c.product_id) === String(productId);
    const matchVariant = variant !== undefined ? (c.variant || "") === variant : true;
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
    (sum, item) => sum + parseItemPrice(item.price) * (Number(item.quantity) || 1),
    0
  );
}

