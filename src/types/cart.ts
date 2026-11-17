import { ProductItem } from "./product";

export const CART_STATUS = {
  FAILED: 0,
  PENDING: 1,
  COMPLETED: 2,
} as const;

export type CartStatus = (typeof CART_STATUS)[keyof typeof CART_STATUS];

export interface CartItem {
  id?: number | string;
  product_id?: number | string;
  name?: string;
  variant?: string;
  quantity?: number;
  price?: number | string;
  size?: string;
  image_url?: string;

}

export interface GetCartParams {
  page?: number;
  limit?: number;
  search?: string;
  user_id?: number | string;
  product_id?: number | string;
}

export interface CartPayload {
  products: string;
  user_id?: number;
  price?: number;
  status?: number;
}

export interface CartContextType {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  cartCount: number;
  setCartCount: (cartCount: number) => void;
  subtotal?: number;
  setSubtotal: (subtotal: number) => void;
}
