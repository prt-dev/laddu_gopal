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
  extractBackendCartItems,
  normalizeCartItem,
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
  getLatestCartByUserId: (userId?: number | string) => Promise<any>;
  createOrUpdateCart: (userIdOverride?: number | string) => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to get devotee/customer user ID directly from localStorage (single user storage key)
export function getDevoteeUserId(): number | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem("web_customer_user");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.id && !isNaN(Number(parsed.id))) return Number(parsed.id);
    }
  } catch { }
  return undefined;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated, user } = useWebAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartId, setCartId] = useState<number | undefined>(() => getStoredCartId());

  // Synchronizes cartId state and localStorage in a single place
  const updateCartId = useCallback((id: number | undefined) => {
    setCartId(id);
    if (id) {
      setStoredCartId(id);
    } else {
      removeStoredCartId();
    }
  }, []);

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
        setCartId(storedId);
      }
    };

    const handleCartIdUpdate = (e: Event) => {
      const customDetail = (e as CustomEvent)?.detail;
      const cid = customDetail && !isNaN(Number(customDetail)) ? Number(customDetail) : getStoredCartId();
      setCartId(cid);
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

        const foundCartId = extractCartId(latestCart);
        if (foundCartId) {
          if (latestCart.status !== undefined && latestCart.status !== null && Number(latestCart.status) !== 1) {
            return;
          }
          updateCartId(foundCartId);
        }

        // Extract items from latestCart using pure helper
        const backendList = extractBackendCartItems(latestCart);

        if (backendList.length > 0) {
          const currentLocal = getLocalCart();
          const mappedItems: CartItem[] = await Promise.all(
            backendList.map(async (c: CartItem) => {
              const existingMatch = currentLocal.find(
                (loc) => String(loc.product_id) === String(c.product_id)
              );
              let localProd = existingMatch || null;

              if (!localProd && c.product_id) {
                try {
                  localProd = (await getProductById(c.product_id)) as any;
                } catch {
                  localProd = null;
                }
              }

              return normalizeCartItem({
                ...(localProd || {}),
                ...c,
                price: c.price || (localProd as any)?.price || 0,
              });
            })
          );

          setItems(mappedItems);
          saveLocalCart(mappedItems);
        } else {
          // If backend cart is empty but local cart has items, sync local items to backend
          const localItems = getLocalCart();
          if (localItems.length > 0) {
            await syncCartToServer(localItems, targetUserId, cartId, token).catch((e) =>
              console.warn("Sync local cart to API failed:", e)
            );
          }
        }
      } catch (err) {
        console.warn("Backend cart sync fallback to local storage:", err);
      }
    },
    [getEffectiveUserId, token, cartId, updateCartId]
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
        await syncCartToServer(updatedItems, uid, cartId, token).catch((err) =>
          console.warn("CartContext: syncUpdatedCart error:", err)
        );
      }
    },
    [getEffectiveUserId, cartId, token]
  );

  // Add to cart method
  const addToCart = useCallback(
    async (payload: Partial<CartItem>) => {
      const updated = addToLocalCartHelper(payload);
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

  // Clear all items from cart locally (preserves server cart record with updated status)
  const clearCart = useCallback(async () => {
    clearLocalCartHelper();
    setItems([]);
    updateCartId(undefined);
  }, [updateCartId]);

  // Refresh cart from localStorage / API
  const refreshCart = useCallback(async () => {
    const local = getLocalCart();
    setItems(local);
    const uid = getEffectiveUserId();
    if (uid || token) {
      await syncWithBackend(uid);
    }
  }, [getEffectiveUserId, token, syncWithBackend]);

  // Fetch latest cart by user_id and synchronize cartId
  const getLatestCartByUserId = useCallback(
    async (userId?: number | string): Promise<any> => {
      const targetUid = getEffectiveUserId(userId);
      if (!targetUid) return null;

      try {
        const res = await fetchLatestCartByUserIdApi(targetUid, token || null);
        if (!res) return null;

        if (res.status !== undefined && res.status !== null && Number(res.status) !== 1) {
          return null;
        }

        const resolvedId = extractCartId(res);
        if (resolvedId) {
          updateCartId(resolvedId);
        }

        return res;
      } catch (err) {
        console.warn("CartContext: getLatestCartByUserId failed:", err);
        return null;
      }
    },
    [getEffectiveUserId, token, updateCartId]
  );

  const cartCount = useMemo(() => getCartCountHelper(items), [items]);
  const subtotal = useMemo(() => getCartSubtotalHelper(items), [items]);

  // Create or Update Cart in backend directly using user_id from fetch user or override
  const createOrUpdateCart = useCallback(
    async (userIdOverride?: number | string): Promise<any> => {
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

      let cartIdToUse: number | undefined = cartId;

      const currentItems = items.length > 0 ? items : getLocalCart();
      const result = await syncCartToServer(currentItems, uidNum, cartIdToUse, token);
      const resId = extractCartId(result);
      if (resId) {
        updateCartId(resId);
      }
      return result;
    },
    [getEffectiveUserId, token, cartId, items, updateCartId]
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
