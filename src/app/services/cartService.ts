import { BASE_URL, getApiHeaders } from "@/app/services/apiClient";
import {
  CART_STATUS,
  CartStatus,
  CartItem,
  GetCartParams,
  CartPayload,
  CartContextType,
} from "@/app/types/cart";

export {
  CART_STATUS,
  type CartStatus,
  type CartItem,
  type GetCartParams,
  type CartPayload,
  type CartContextType,
};

export const CART_STORAGE_KEY = "web_customer_cart";

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
    image_url: image,
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
 * Format cart payload for backend API
 */
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

// ==========================================
// 1. LOCAL CART STORAGE CRUD FUNCTIONS
// ==========================================

/**
 * Get all cart items saved in localStorage
 */
export function getLocalCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read cart items from localStorage:", err);
  }
  return [];
}

/**
 * Save cart items to localStorage and trigger cart_updated event
 */
export function saveLocalCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cart_updated"));
    // if (window.dispatchEvent(new CustomEvent("cart_updated"))) {
    //   console.log("event dispatched");
    // }
  } catch (err) {
    console.error("Failed to save cart items to localStorage:", err);
  }
}

/**
 * Add an item to localStorage cart (creates or increments quantity)
 */
export function addLocalCartItem(item: Partial<CartItem>): CartItem[] {
  const current = getLocalCartItems();

  const existingIndex = current.findIndex(
    (c) =>
      String(c.product_id) === String(item.product_id) &&
      (c.variant || "") === (item.variant || "")
  );

  let updated: CartItem[];
  if (existingIndex > -1) {
    updated = current.map((c, idx) => {
      if (idx === existingIndex) {
        return {
          ...c,
          ...item,
          quantity: (c.quantity || 1) + (item.quantity || 1),
          price: item.price ? item.price : c.price,
        };
      }
      return c;
    });
  } else {
    updated = [...current, item];
  }

  saveLocalCartItems(updated);
  return updated;
}

/**
 * Update quantity of a cart item in localStorage
 */
export function updateLocalCartItemQuantity(
  productId: number | string,
  deltaOrQty: number,
  variant?: string,
  isAbsolute: boolean = false
): number {
  const current = getLocalCartItems();
  let updatedQty: number = 0;
  const updated = current
    .map((c) => {
      const matchId = String(c.product_id) === String(productId);
      const matchVariant = variant !== undefined ? (c.variant || "") === variant : true;
      if (matchId && matchVariant) {
        const curQty = c.quantity || 1;
        const newQty = isAbsolute
          ? Math.max(1, deltaOrQty)
          : Math.max(1, curQty + deltaOrQty);
        updatedQty = newQty;
        return { ...c, quantity: newQty };
      }
      return c;
    })
    .filter((c) => (c.quantity || 0) > 0);

  saveLocalCartItems(updated);
  return updatedQty;
}

/**
 * Remove a cart item from localStorage
 */
export function removeLocalCartItem(
  productId: number | string,
  variant?: string
): CartItem[] {
  const current = getLocalCartItems();
  const updated = current.filter((c) => {
    const matchId = String(c.product_id) === String(productId);
    const matchVariant = variant !== undefined ? (c.variant || "") === variant : true;
    return !(matchId && matchVariant);
  });

  saveLocalCartItems(updated);
  return updated;
}

/**
 * Clear all cart items from localStorage
 */
export function clearLocalCartItems(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, '');
    window.dispatchEvent(new Event("cart_updated"));
  } catch (err) {
    console.error("Failed to clear local cart items:", err);
  }
}

/**
 * Calculate total quantity of all items in cart
 */
export function getCartItemsCount(items?: CartItem[]): number {
  const list = items || getLocalCartItems();
  return list.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}

/**
 * Calculate total subtotal amount of all items in cart
 */
export function getCartItemsSubtotal(items?: CartItem[]): number {
  const list = items || getLocalCartItems();
  return list.reduce(
    (sum, item) => sum + parseItemPrice(item.price) * (Number(item.quantity) || 1),
    0
  );
}

// ==========================================
// 2. BACKEND CART SYNCING FUNCTIONS
// ==========================================

/**
 * Fetch latest pending cart for user from backend
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
      headers: getApiHeaders(token),
    });
    if (!response.ok) return null;
    return response.json();
  } catch (err) {
    console.warn("Could not get latest cart by user_id:", err);
    return null;
  }
}

/**
 * Single Backend Cart Syncing Function
 * Sends the current cart storage value to the backend API.
 * Uses PUT if cartId exists, otherwise POST to create.
 */
export async function syncCartToServer(
  items: CartItem[] | string,
  token?: string | null,
  userId?: number | string
): Promise<any> {
  if (!userId || isNaN(Number(userId)) || !token) return null;

  // Create new cart on backend
  try {
    if (typeof items != "string") {
      items = JSON.stringify(items);
    }
    const payload = {
      user_id: Number(userId),
      cartItems: items,
    }
    const response = await fetch(`${BASE_URL}/carts/cartSync`, {
      method: "POST",
      headers: getApiHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn("POST /carts/cartSync failed:", errorData);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.warn("POST /carts/cartSync request error:", err);
    return null;
  }
}

/**
 * Update Cart Status (e.g. 1 = pending, 2 = completed)
 */
export async function updateCartStatusApi(
  status: number,
  cartId?: number | string,
  token?: string
): Promise<any> {
  if (!cartId || isNaN(Number(cartId)) || Number(cartId) >= 100000000000) return null;
  try {
    const response = await fetch(`${BASE_URL}/carts/${cartId}`, {
      method: "PUT",
      headers: getApiHeaders(token),
      body: JSON.stringify({ status: Number(status) }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn(`Failed to update cart ${cartId} status to ${status}:`, err);
    return null;
  }
}
