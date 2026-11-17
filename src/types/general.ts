import { ProductItem } from "./product";
import { CategoryItem } from "./category";
import { CartItem } from "./cart";

export interface GeneralContextType {
  // Products
  products: ProductItem[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  getCollectionProducts: (keyOrCategory?: string, limit?: number) => ProductItem[];
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
