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
import { getProducts, ProductItem } from "@/app/services/productService";
import { getCategories, CategoryItem } from "@/app/services/categoryService";
import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/app/services/cartService";

export interface GeneralContextType {
  // Products
  products: ProductItem[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  topSellingProducts: ProductItem[];
  pagdiProducts: ProductItem[];
  kundanProducts: ProductItem[];
  getProductById: (id: string | number) => ProductItem | undefined;
  getProductsByCategory: (categoryIdOrName: string | number) => ProductItem[];

  // Categories
  categories: CategoryItem[];
  isLoadingCategories: boolean;
  refreshCategories: () => Promise<void>;

  // Cart (shared from CartContext)
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartLoading: boolean;
  cartId?: number;
  cart_id?: number;
  addToCart: (payload: Partial<CartItem>) => Promise<void>;
  updateCartQuantity: (
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

  // Combined Status & Actions
  isLoading: boolean;
  refreshAll: () => Promise<void>;
}

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export function GeneralProvider({ children }: { children: ReactNode }) {
  const {
    items: cartItems,
    cartCount,
    subtotal: cartSubtotal,
    isLoading: isCartLoading,
    cartId,
    cart_id,
    addToCart,
    updateQuantity: updateCartQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getLatestCartByUserId,
    createOrUpdateCart,
  } = useCart();

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
      console.warn("GeneralContext: Failed to fetch products:", err);
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
      console.warn("GeneralContext: Failed to fetch categories:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // 3. Combined Refresh
  const refreshAll = useCallback(async () => {
    await Promise.all([refreshProducts(), refreshCategories(), refreshCart()]);
  }, [refreshProducts, refreshCategories, refreshCart]);

  // 4. Initial Fetch on Mount (Once across the entire app)
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
        console.warn("GeneralContext: Initial store load error:", err);
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

  // 5. Memoized Product Subsets
  const topSellingProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const pagdiProducts = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (p.category || "").toLowerCase() === "pagdi" ||
        p.category_id === 1 ||
        p.category_id === 2 ||
        (p.name || "").toLowerCase().includes("pagdi")
    );
    return filtered.slice(0, 4);
  }, [products]);

  const kundanProducts = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (p.category || "").toLowerCase().includes("kundan") ||
        p.category_id === 3 ||
        (p.name || "").toLowerCase().includes("kundan")
    );
    return filtered.slice(0, 4);
  }, [products]);

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
      const searchStr = categoryIdOrName.toLowerCase().trim();
      return products.filter(
        (p) =>
          String(p.category_id) === searchStr ||
          (p.category || "").toLowerCase().trim() === searchStr
      );
    },
    [products]
  );

  const value: GeneralContextType = {
    products,
    isLoadingProducts,
    refreshProducts,
    topSellingProducts,
    pagdiProducts,
    kundanProducts,
    getProductById,
    getProductsByCategory,
    categories,
    isLoadingCategories,
    refreshCategories,
    cartItems,
    cartCount,
    cartSubtotal,
    isCartLoading,
    cartId,
    cart_id,
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
