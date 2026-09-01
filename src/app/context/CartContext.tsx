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
  getMyCartApi,
  addToCartApi,
  updateCartItemApi,
  deleteCartItemApi,
  clearMyCartApi,
} from "@/app/services/cartService";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { getProductById, ProductItem } from "@/app/services/productService";

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  isLoading: boolean;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useWebAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    };

    window.addEventListener("cart_updated", handleCartUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === "web_customer_cart") {
        handleCartUpdate();
      }
    });

    return () => {
      window.removeEventListener("cart_updated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  // Fetch / Sync cart from backend when authenticated
  const syncWithBackend = useCallback(async () => {
    if (!token || !isAuthenticated) return;

    try {
      const response = await getMyCartApi(token);
      const backendList: CartItem[] =
        response.items ||
        response.carts ||
        (Array.isArray(response) ? response : []);

      if (backendList && backendList.length > 0) {
        const mappedItems: CartItem[] = await Promise.all(
          backendList.map(async (c: CartItem) => {
            const localProd = c.product_id
              ? await getProductById(c.product_id)
              : null;
            const prodPrice = localProd
              ? typeof localProd.price === "number"
                ? localProd.price
                : parseFloat(String(localProd.price).replace(/[^0-9.]/g, "")) ||
                0
              : 0;

            const finalPrice =
              typeof c.price === "number"
                ? c.price
                : c.price
                  ? parseFloat(String(c.price).replace(/[^0-9.]/g, "")) || prodPrice
                  : prodPrice;

            return {
              id: c.id || c.product_id || Date.now(),
              product_id: c.product_id,
              img:
                (c.product?.image_url as string) ||
                localProd?.img ||
                localProd?.image_url ||
                "/assets/best-selling.png",
              name:
                (c.product?.name as string) ||
                localProd?.name ||
                "Devotional Sacred Item",
              variant: c.variant || "Standard Size",
              size: c.variant || "Standard Size",
              price: finalPrice,
              quantity: c.quantity || 1,
              product: c.product || (localProd as any),
            };
          })
        );

        // Update localStorage and state with backend cart items
        saveLocalCart(mappedItems);
        setItems(mappedItems);
      } else {
        // If backend cart is empty but local cart has items, sync local items to backend
        const localItems = getLocalCart();
        if (localItems.length > 0) {
          for (const item of localItems) {
            if (item.product_id) {
              await addToCartApi(
                {
                  product_id: Number(item.product_id),
                  variant: item.variant || item.size,
                  quantity: item.quantity,
                  price: item.price,
                },
                token
              ).catch((e) => console.warn("Sync local item to API failed:", e));
            }
          }
        }
      }
    } catch (err) {
      console.warn("Backend cart sync fallback to local storage:", err);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && token) {
      syncWithBackend();
    }
  }, [isAuthenticated, token, syncWithBackend]);

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

      setItems(updated);

      // If user is authenticated, sync with backend API
      if (token && prodId !== undefined) {
        try {
          await addToCartApi(
            {
              product_id: Number(prodId),
              variant: payload.variant || payload.size || undefined,
              quantity: payload.quantity || 1,
              price: numPrice,
            },
            token
          );
        } catch (err) {
          console.warn("Could not sync added cart item with API:", err);
        }
      }
    },
    [token]
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
      setItems(updated);

      if (token) {
        const found = updated.find(
          (c) =>
            (String(c.id) === String(id) ||
              String(c.product_id) === String(id)) &&
            (variant !== undefined ? (c.variant || c.size) === variant : true)
        );
        if (found && found.id !== undefined) {
          try {
            await updateCartItemApi(
              found.id,
              {
                quantity: found.quantity,
                variant: found.variant || found.size,
                price: found.price,
              },
              token
            );
          } catch (err) {
            console.warn("Could not sync updated quantity with API:", err);
          }
        }
      }
    },
    [token]
  );

  // Remove single item from cart
  const removeFromCart = useCallback(
    async (id: number | string, variant?: string) => {
      const updated = removeLocalCartItemHelper(id, variant);
      setItems(updated);

      if (token) {
        try {
          await deleteCartItemApi(id, token);
        } catch (err) {
          console.warn("Could not sync item deletion with API:", err);
        }
      }
    },
    [token]
  );

  // Clear all items from cart
  const clearCart = useCallback(async () => {
    clearLocalCartHelper();
    setItems([]);

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
    if (token) {
      await syncWithBackend();
    }
  }, [token, syncWithBackend]);

  const cartCount = useMemo(() => getCartCountHelper(items), [items]);
  const subtotal = useMemo(() => getCartSubtotalHelper(items), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
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
