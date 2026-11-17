"use client";

import { useSearchParams } from "next/navigation";
import ProductDetail from "./ProductDetail";
import DetailSidebar from "./DetailSidebar";
import RelatedProducts from "./RelatedProducts";

export default function ShopDetailClient() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const sizeParam = searchParams.get("size");

  const productId = idParam ? parseInt(idParam, 10) : 1;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10">
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        <ProductDetail productId={productId} initialSize={sizeParam || undefined} />
        <DetailSidebar currentProductId={productId} />
      </div>
      <RelatedProducts currentId={productId} />
    </div>
  );
}
