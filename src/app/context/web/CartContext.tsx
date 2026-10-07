"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  CartItem,
  CartContextType,
  getLocalCartItems,
  getCartItemsSubtotal,
  syncCartToServer,
  getCartItemsCount,
} from "@/app/services/cartService";
import { useWebAuth } from "./WebAuthContext";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CART_STORAGE_KEY = "web_customer_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, token } = useWebAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);


  useEffect(() => {
    async function refreshCart() {

      const localCartItems = getLocalCartItems();
      setItems(localCartItems);
      setCartCount(getCartItemsCount(localCartItems));
      setSubtotal(getCartItemsSubtotal(localCartItems));

      if (user || token) {
        await syncCartToServer(localCartItems, token, user?.id);
      }

    }

    refreshCart();

    window.addEventListener("cart_updated", refreshCart);
    return () => window.removeEventListener("cart_updated", refreshCart);

  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        cartCount,
        setCartCount,
        subtotal,
        setSubtotal,
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
