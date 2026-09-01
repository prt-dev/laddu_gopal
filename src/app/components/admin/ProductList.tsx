"use client";

import React, { useEffect, useState } from "react";
import ProductTable from "@/app/components/admin/ProductTable";
import { ProductItem, getProducts } from "@/app/services/productService";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/common/Loading";

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
        const data = await getProducts({ limit: 100 }, authToken);
        if (Array.isArray(data)) {
          setProductsList(data);
        } else if (data?.products && Array.isArray(data.products)) {
          setProductsList(data.products);
        } else if (data?.items && Array.isArray(data.items)) {
          setProductsList(data.items);
        } else {
          setProductsList([]);
        }
      } catch (err: any) {
        console.error("Error loading products:", err);
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
    return <Loading variant="container" size="md" message="Loading products..." />;
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
