"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { getRelatedProducts, ProductItem } from "@/app/data/products";

interface RelatedProductsProps {
  currentId?: number;
}

export default function RelatedProducts({ currentId = 1 }: RelatedProductsProps) {
  const related: ProductItem[] = getRelatedProducts(currentId, 3);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});

  const handleSelectSize = (productId: number, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  return (
    <div className="mt-12 border-t border-[#fff0ad] pt-8">
      <h2 className="heading-font text-xl font-bold text-[#d20b4f] mb-6">
        Related Shringar Items
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3">
        {related.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selectedSize={selectedSizes[product.id]}
            onSelectSize={handleSelectSize}
          />
        ))}
      </div>
    </div>
  );
}
