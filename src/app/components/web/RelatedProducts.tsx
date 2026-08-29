"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getProducts, ProductItem } from "@/app/services/productService";

interface RelatedProductsProps {
  currentId?: number | string;
}

export default function RelatedProducts({ currentId = 1 }: RelatedProductsProps) {
  const [related, setRelated] = useState<ProductItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});

  const numericCurrentId = typeof currentId === "string" ? parseInt(currentId, 10) : currentId;

  useEffect(() => {
    let isMounted = true;
    async function loadRelated() {
      try {
        const res = await getProducts({ limit: 10 });
        if (isMounted) {
          const filtered = res.products.filter((p) => p.id !== numericCurrentId).slice(0, 3);
          setRelated(filtered);
        }
      } catch (err) {
        console.error("Error loading related products:", err);
      }
    }
    loadRelated();
    return () => {
      isMounted = false;
    };
  }, [numericCurrentId]);

  const handleSelectSize = (productId: number, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  if (related.length === 0) return null;

  return (
    <div className="mt-12 border-t border-[#fff0ad] pt-8">
      <h2 className="heading-font text-xl font-bold text-[#d20b4f] mb-6">
        Related Shringar Items
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
        {related.map((product) => (
          <ProductCard
            key={product.id}
            product={product as any}
            selectedSize={product.id ? selectedSizes[product.id] : undefined}
            onSelectSize={handleSelectSize}
          />
        ))}
      </div>
    </div>
  );
}
