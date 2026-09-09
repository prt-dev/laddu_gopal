"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

import {
  CartItem,
  getLocalCart,
  saveLocalCart,
  addToLocalCart as addToLocalCartHelper,
  updateLocalCartQuantity as updateLocalCartQtyHelper,
  removeLocalCartItem as removeLocalCartItemHelper,
  clearLocalCart as clearLocalCartHelper,
  getCartCount as getCartCountHelper,
  getCartSubtotal as getCartSubtotalHelper,
  addToCartApi,
  updateCartItemApi,
  deleteCartItemApi,
  clearMyCartApi,
  getLatestCartByUserId as fetchLatestCartByUserIdApi,
  createOrUpdateCartApi,
  getStoredCartId,
  setStoredCartId,
  removeStoredCartId,
  syncCartToServer,
  extractCartId,
} from "@/app/services/cartService";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { getProductById, ProductItem } from "@/app/services/productService";

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  isLoading: boolean;
  cartId?: number;
  cart_id?: number;
  addToCart: (payload: Partial<CartItem>) => Promise<void>;
  updateQuantity: (
    id: number | string,
    deltaOrQty: number,
    variant?: string,
    isAbsolute?: boolean
  ) => Promise<void>;
  removeFromCart: (id: number | string, variant?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getLatestCartByUserId: (userId?: number | string) => Promise<CartItem | null>;
  createOrUpdateCart: (userIdOverride?: number | string) => Promise<CartItem | null>;
  createOrUpdateCard: (userIdOverride?: number | string) => Promise<CartItem | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to get devotee/customer user ID directly from localStorage
export function getDevoteeUserId(): number | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const directId = localStorage.getItem("devotee_user_id");
    if (directId && !isNaN(Number(directId))) return Number(directId);

    const devotee = localStorage.getItem("devotee_user");
    if (devotee) {
      const parsed = JSON.parse(devotee);
      if (parsed?.id && !isNaN(Number(parsed.id))) return Number(parsed.id);
    }

    const customer = localStorage.getItem("web_customer_user");
    if (customer) {
      const parsed = JSON.parse(customer);
      if (parsed?.id && !isNaN(Number(parsed.id))) return Number(parsed.id);
    }
  } catch { }
  return undefined;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated, user } = useWebAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCartId, setActiveCartId] = useState<number | undefined>(() => getStoredCartId());

  // Resolve user_id directly from parameter, user object, or fetched devotee stored in localStorage
  const getEffectiveUserId = useCallback(
    (overrideId?: number | string): number | undefined => {
      if (overrideId !== undefined && overrideId !== null && !isNaN(Number(overrideId))) {
        return Number(overrideId);
      }
      if (user?.id && !isNaN(Number(user.id))) {
        return Number(user.id);
      }
      return getDevoteeUserId();
    },
    [user]
  );

  // Initialize cart from localStorage immediately on mount
  useEffect(() => {
    const localItems = getLocalCart();
    setItems(localItems);
    setIsLoading(false);
  }, []);

  // Listen for localStorage changes across tabs or custom events
  useEffect(() => {
    const handleCartUpdate = () => {
      const updated = getLocalCart();
      setItems(updated);
      const storedId = getStoredCartId();
      if (storedId) {
        setActiveCartId(storedId);
      }
    };

    const handleCartIdUpdate = (e: Event) => {
      const customDetail = (e as CustomEvent)?.detail;
      const cid = customDetail && !isNaN(Number(customDetail)) ? Number(customDetail) : getStoredCartId();
      setActiveCartId(cid);
    };

    window.addEventListener("cart_updated", handleCartUpdate);
    window.addEventListener("cart_id_updated", handleCartIdUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === "web_customer_cart" || e.key === "active_cart_id" || e.key === "cart_id") {
        handleCartUpdate();
      }
    });

    return () => {
      window.removeEventListener("cart_updated", handleCartUpdate);
      window.removeEventListener("cart_id_updated", handleCartIdUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  // Fetch / Sync cart from backend directly using user_id from fetch user / devotee profile
  const syncWithBackend = useCallback(
    async (userIdOverride?: number | string) => {
      try {
        const targetUserId = getEffectiveUserId(userIdOverride);
        if (!targetUserId) return;

        const latestCart = await fetchLatestCartByUserIdApi(targetUserId, token || null);

        if (latestCart && latestCart.id && !isNaN(Number(latestCart.id))) {
          if (latestCart.status !== undefined && latestCart.status !== null && Number(latestCart.status) !== 1) {
            return;
          }
          const parsedId = Number(latestCart.id);
          setActiveCartId(parsedId);
          setStoredCartId(parsedId);
        }

        // Extract items from latestCart: unpacked from products JSON, or single item / list
        let backendList: CartItem[] = [];

        if (latestCart && (latestCart as any).products) {
          try {
            const rawProds = (latestCart as any).products;
            const parsed = typeof rawProds === "string" ? JSON.parse(rawProds) : rawProds;
            if (Array.isArray(parsed) && parsed.length > 0) {
              backendList = parsed;
            }
          } catch (e) {
            console.warn("Could not parse products JSON from latest cart:", e);
          }
        }

        if (backendList.length === 0 && latestCart) {
          if (Array.isArray(latestCart)) {
            backendList = latestCart;
          } else if ((latestCart as any).items && Array.isArray((latestCart as any).items)) {
            backendList = (latestCart as any).items;
          } else if ((latestCart as any).carts && Array.isArray((latestCart as any).carts)) {
            backendList = (latestCart as any).carts;
          } else if (latestCart.id || latestCart.product_id) {
            backendList = [latestCart];
          }
        }

        if (backendList && backendList.length > 0) {
          const mappedItems: CartItem[] = await Promise.all(
            backendList.map(async (c: CartItem) => {
              const localProd = c.product_id
                ? await getProductById(c.product_id)
                : null;
              return {
                ...c,
                id: c.id,
                product_id: c.product_id,
                name: c.name || localProd?.name || c.product?.name,
                variant: c.variant || c.size || "Standard Size",
                size: c.variant || c.size || "Standard Size",
                price: Number(c.price || (localProd as any)?.discount_price || localProd?.price || 0),
                quantity: Number(c.quantity || 1),
                img:
                  c.img ||
                  localProd?.image_url ||
                  localProd?.img ||
                  c.product?.image_url ||
                  "/assets/best-selling.png",
                product: localProd || c.product,
              };
            })
          );

          setItems(mappedItems);
          saveLocalCart(mappedItems);
        } else {
          // If backend cart is empty but local cart has items, sync local items to backend
          const localItems = getLocalCart();
          if (localItems.length > 0) {
            await syncCartToServer(localItems, targetUserId, activeCartId, token).catch((e) =>
              console.warn("Sync local cart to API failed:", e)
            );
          }
        }
      } catch (err) {
        console.warn("Backend cart sync fallback to local storage:", err);
      }
    },
    [getEffectiveUserId, token, activeCartId]
  );

  // Sync with backend whenever an effective user ID is available
  // useEffect(() => {
  //   const uid = getEffectiveUserId();
  //   if (uid) {
  //     syncWithBackend(uid);
  //   }
  // }, [getEffectiveUserId, syncWithBackend]);

  // Listen for user fetch events from devotee/checkout actions
  useEffect(() => {
    const handleDevoteeUpdate = (e?: Event) => {
      const customDetail = (e as CustomEvent)?.detail;
      const uid = customDetail && !isNaN(Number(customDetail)) ? Number(customDetail) : getEffectiveUserId();
      if (uid && !isNaN(uid)) {
        syncWithBackend(uid);
      }
    };

    window.addEventListener("devotee_user_updated", handleDevoteeUpdate);
    return () => {
      window.removeEventListener("devotee_user_updated", handleDevoteeUpdate);
    };
  }, [getEffectiveUserId, syncWithBackend]);

  // Single function to sync updated cart items to local state & server
  const syncUpdatedCart = useCallback(
    async (updatedItems: CartItem[]) => {
      setItems(updatedItems);
      const uid = getEffectiveUserId();
      if (uid) {
        await syncCartToServer(updatedItems, uid, activeCartId, token).catch((err) =>
          console.warn("CartContext: syncUpdatedCart error:", err)
        );
      }
    },
    [getEffectiveUserId, activeCartId, token]
  );

  // Add to cart method
  const addToCart = useCallback(
    async (payload: Partial<CartItem>) => {
      const prodId = payload.product_id !== undefined ? payload.product_id : payload.id;
      const numPrice =
        typeof payload.price === "number"
          ? payload.price
          : parseFloat(String(payload.price || 0).replace(/[^0-9.]/g, "")) || 0;

      const updated = addToLocalCartHelper({
        ...payload,
        id: prodId,
        product_id: prodId,
        variant: payload.variant || payload.size || "Standard Size",
        size: payload.variant || payload.size || "Standard Size",
        price: numPrice,
        quantity: payload.quantity || 1,
        name: payload.name || payload.product?.name,
        img:
          payload.img ||
          payload.product?.image_url ||
          payload.product?.img ||
          "/assets/best-selling.png",
        product: payload.product,
      });

      await syncUpdatedCart(updated);
    },
    [syncUpdatedCart]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (
      id: number | string,
      deltaOrQty: number,
      variant?: string,
      isAbsolute: boolean = false
    ) => {
      const updated = updateLocalCartQtyHelper(
        id,
        deltaOrQty,
        variant,
        isAbsolute
      );
      await syncUpdatedCart(updated);
    },
    [syncUpdatedCart]
  );

  // Remove single item from cart
  const removeFromCart = useCallback(
    async (id: number | string, variant?: string) => {
      const updated = removeLocalCartItemHelper(id, variant);
      await syncUpdatedCart(updated);
    },
    [syncUpdatedCart]
  );

  // Clear all items from cart
  const clearCart = useCallback(async () => {
    clearLocalCartHelper();
    setItems([]);
    setActiveCartId(undefined);
    removeStoredCartId();

    if (token) {
      try {
        await clearMyCartApi(token);
      } catch (err) {
        console.warn("Could not sync clear cart with API:", err);
      }
    }
  }, [token]);

  // Refresh cart from localStorage / API
  const refreshCart = useCallback(async () => {
    const local = getLocalCart();
    setItems(local);
    const uid = getEffectiveUserId();
    if (uid || token) {
      await syncWithBackend(uid);
    }
  }, [getEffectiveUserId, token, syncWithBackend]);

  // Fetch latest cart by user_id and synchronize activeCartId
  const getLatestCartByUserId = useCallback(
    async (userId?: number | string): Promise<CartItem | null> => {
      const targetUid = getEffectiveUserId(userId);
      if (!targetUid) return null;

      try {
        const res = await fetchLatestCartByUserIdApi(targetUid, token || null);
        if (!res) return null;

        if (res.status !== undefined && res.status !== null && Number(res.status) !== 1) {
          return null;
        }

        let latestItem: CartItem | null = null;
        if (Array.isArray(res)) {
          latestItem = res.length > 0 ? res[0] : null;
        } else if ((res as any).carts && Array.isArray((res as any).carts)) {
          latestItem = (res as any).carts.length > 0 ? (res as any).carts[0] : null;
        } else if ((res as any).items && Array.isArray((res as any).items)) {
          latestItem = (res as any).items.length > 0 ? (res as any).items[0] : null;
        } else if ((res as any).data && Array.isArray((res as any).data)) {
          latestItem = (res as any).data.length > 0 ? (res as any).data[0] : null;
        } else if ((res as any).id) {
          latestItem = res as CartItem;
        }

        if (latestItem?.id && !isNaN(Number(latestItem.id))) {
          const parsedId = Number(latestItem.id);
          setActiveCartId(parsedId);
          if (typeof window !== "undefined") {
            localStorage.setItem("active_cart_id", String(parsedId));
            localStorage.setItem("cart_id", String(parsedId));
          }
        }

        return latestItem;
      } catch (err) {
        console.warn("CartContext: getLatestCartByUserId failed:", err);
        return null;
      }
    },
    [getEffectiveUserId, token]
  );

  // Sync cartId whenever effective user id is available and no activeCartId
  useEffect(() => {
    const uid = getEffectiveUserId();
    if (uid && !activeCartId) {
      getLatestCartByUserId(uid);
    }
  }, [getEffectiveUserId, activeCartId, getLatestCartByUserId]);

  // Compute resolved cart_id: activeCartId or first valid DB ID from items
  const cartId = useMemo(() => {
    if (activeCartId) return activeCartId;
    return undefined;
  }, [activeCartId]);

  const cartCount = useMemo(() => getCartCountHelper(items), [items]);
  const subtotal = useMemo(() => getCartSubtotalHelper(items), [items]);

  // Create or Update Cart in backend directly using user_id from fetch user or override
  const createOrUpdateCart = useCallback(
    async (userIdOverride?: number | string): Promise<CartItem | null> => {
      let targetUid = userIdOverride;
      if (!userIdOverride) {
        targetUid = getEffectiveUserId();
      }
      if (!targetUid) {
        console.warn("CartContext: Cannot create or update cart without user_id");
        return null;
      }

      const uidNum = Number(targetUid);
      if (isNaN(uidNum)) return null;

      // Determine existing cart_id: activeCartId or fetch latest cart
      let cartIdToUse: number | undefined = activeCartId;

      const currentItems = items.length > 0 ? items : getLocalCart();
      const result = await syncCartToServer(currentItems, uidNum, cartIdToUse, token);
      const resId = extractCartId(result);
      if (resId) {
        setActiveCartId(resId);
      }
      return result;
    },
    [getEffectiveUserId, token, activeCartId, items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        isLoading,
        cartId,
        cart_id: cartId,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        getLatestCartByUserId,
        createOrUpdateCart,
        createOrUpdateCard: createOrUpdateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
