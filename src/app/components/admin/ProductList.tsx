"use client";

import React, { useEffect, useState } from "react";
import ProductTable from "@/app/components/admin/ProductTable";
import { ProductItem, getProducts } from "@/app/services/productService";
import { useAuth } from "@/app/context/AuthContext";

export default function ProductList() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async (authToken: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts({}, authToken);
        if (Array.isArray(data)) {
          setProductsList(data);
        } else if (data?.items && Array.isArray(data.items)) {
          setProductsList(data.items);
        } else if (data?.products && Array.isArray(data.products)) {
          setProductsList(data.products);
        } else {
          setProductsList([]);
        }
      } catch (err: any) {
        console.error("Failed to load products:", err);
        setError(err?.message || "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadProducts(token);
    } else if (!isAuthLoading && !token) {
      setIsLoading(false);
    }
  }, [token, isAuthLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <svg
          className="w-6 h-6 mr-3 animate-spin text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  return <ProductTable data={productsList} />;
}
