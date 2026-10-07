"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { GeneralContextType } from "@/app/types/general";
import { getProducts, ProductItem } from "@/app/services/productService";
import { getCategories, CategoryItem } from "@/app/services/categoryService";
import { useCart } from "@/app/context/CartContext";
import {
  CartItem,
  addLocalCartItem,
  updateLocalCartItemQuantity,
  removeLocalCartItem,
  clearLocalCartItems,
  getLocalCartItems,
} from "@/app/services/cartService";

export type { GeneralContextType };

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export function GeneralProvider({ children }: { children: ReactNode }) {
  const {
    items: cartItems,
    cartCount,
    subtotal,
  } = useCart();
  const cartSubtotal = subtotal || 0;

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  // 1. Fetch Products
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const res = await getProducts({ limit: 100 });
      setProducts(res.products || []);
    } catch (err) {
      console.warn("Failed to fetch products:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // 2. Fetch Categories
  const refreshCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const res = await getCategories({ limit: 100 });
      setCategories(res.categories || []);
    } catch (err) {
      console.warn("Failed to fetch categories:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Cart action helpers
  const addToCart = useCallback(async (payload: Partial<CartItem>) => {
    addLocalCartItem(payload);
  }, []);

  const updateCartQuantity = useCallback(
    async (
      id: number | string,
      deltaOrQty: number,
      variant?: string,
      isAbsolute?: boolean
    ) => {
      updateLocalCartItemQuantity(id, deltaOrQty, variant, isAbsolute);
    },
    []
  );

  const removeFromCart = useCallback(
    async (id: number | string, variant?: string) => {
      removeLocalCartItem(id, variant);
    },
    []
  );

  const clearCart = useCallback(async () => {
    clearLocalCartItems();
  }, []);

  const refreshCart = useCallback(async () => {
    getLocalCartItems();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cart_updated"));
    }
  }, []);

  const getLatestCartByUserId = useCallback(async () => {
    return null;
  }, []);

  const createOrUpdateCart = useCallback(async () => {
    return null;
  }, []);

  // 3. Combined Refresh
  const refreshAll = useCallback(async () => {
    await Promise.all([refreshProducts(), refreshCategories(), refreshCart()]);
  }, [refreshProducts, refreshCategories, refreshCart]);

  // 4. Initial Fetch on Mount
  useEffect(() => {
    let isMounted = true;

    async function initializeStore() {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts({ limit: 100 }),
          getCategories({ limit: 100 }),
        ]);
        if (isMounted) {
          setProducts(prodRes.products || []);
          setCategories(catRes.categories || []);
        }
      } catch (err) {
        console.warn("Initial store load error:", err);
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
          setIsLoadingCategories(false);
        }
      }
    }

    initializeStore();

    return () => {
      isMounted = false;
    };
  }, []);

  // 5. Dynamic Collection Products Resolver using dynamic key/category matching
  const getCollectionProducts = useCallback(
    (keyOrCategory?: string, limit?: number): ProductItem[] => {
      const q = (keyOrCategory || "").toLowerCase().trim();

      let filtered: ProductItem[];
      if (!q || q === "top-selling" || q === "topselling" || q === "all") {
        filtered = products;
      } else {
        filtered = products.filter(
          (p) =>
            String(p.category_id) === q ||
            (p.category || "").toLowerCase().trim() === q ||
            (p.category || "").toLowerCase().includes(q) ||
            (p.name || "").toLowerCase().includes(q)
        );
      }

      return limit ? filtered.slice(0, limit) : filtered;
    },
    [products]
  );

  // 6. Helpers
  const getProductById = useCallback(
    (id: string | number): ProductItem | undefined => {
      const numId = typeof id === "string" ? parseInt(id, 10) : id;
      return products.find((p) => p.id === numId || String(p.id) === String(id));
    },
    [products]
  );

  const getProductsByCategory = useCallback(
    (categoryIdOrName: string | number): ProductItem[] => {
      if (typeof categoryIdOrName === "number") {
        return products.filter((p) => p.category_id === categoryIdOrName);
      }
      return getCollectionProducts(categoryIdOrName);
    },
    [getCollectionProducts, products]
  );

  const value: GeneralContextType = {
    products,
    isLoadingProducts,
    refreshProducts,
    getCollectionProducts,
    getProductById,
    getProductsByCategory,
    categories,
    isLoadingCategories,
    refreshCategories,
    cartItems,
    cartCount,
    cartSubtotal,
    isCartLoading: false,
    cartId: undefined,
    cart_id: undefined,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getLatestCartByUserId,
    createOrUpdateCart,
    isLoading: isLoadingProducts || isLoadingCategories,
    refreshAll,
  };

  return <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>;
}

export function useGeneral(): GeneralContextType {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error("useGeneral must be used within a GeneralProvider");
  }
  return context;
}
