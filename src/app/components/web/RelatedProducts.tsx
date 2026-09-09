"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useGeneral } from "@/app/context/GeneralContext";

interface RelatedProductsProps {
  currentId?: number | string;
}

export default function RelatedProducts({ currentId = 1 }: RelatedProductsProps) {
  const { products } = useGeneral();
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});

  const numericCurrentId = typeof currentId === "string" ? parseInt(currentId, 10) : currentId;

  const related = useMemo(() => {
    return products.filter((p) => p.id !== numericCurrentId).slice(0, 3);
  }, [products, numericCurrentId]);

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
