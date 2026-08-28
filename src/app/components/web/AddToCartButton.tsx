"use client";

import React, { useState } from "react";
import { addToCartApi } from "@/app/services/cartService";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { ProductItem as ApiProductItem } from "@/app/services/productService";
import { ProductItem as StaticProductItem } from "@/app/data/products";

export interface AddToCartButtonProps {
  productId: number | string;
  variant?: string; // variant is size of product (e.g., "Size 4", "Size 0")
  price: number | string;
  quantity?: number;
  product?: ApiProductItem | StaticProductItem;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  loadingText?: string;
  successText?: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export default function AddToCartButton({
  productId,
  variant,
  price,
  quantity = 1,
  product,
  className = "",
  children,
  showIcon = false,
  loadingText = "Adding...",
  successText = "Added!",
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const { token } = useWebAuth();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addStatus, setAddStatus] = useState<"idle" | "success" | "error">("idle");

  const parsePrice = (priceVal: number | string): number => {
    if (typeof priceVal === "number") return priceVal;
    const cleanStr = priceVal.replace(/[^0-9.]/g, "");
    return parseFloat(cleanStr) || 0;
  };

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isAdding) return;

    setIsAdding(true);
    setAddStatus("idle");

    try {
      const numericPrice = parsePrice(price);
      await addToCartApi(
        {
          product_id: Number(productId),
          variant: variant || undefined, // variant is size of product
          quantity: quantity,
          price: numericPrice,
        },
        token || undefined
      );

      setAddStatus("success");
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        setAddStatus("idle");
      }, 2500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Still show success indicator for optimistic devotional experience
      setAddStatus("success");
      if (onError) {
        onError(error);
      }
      setTimeout(() => {
        setAddStatus("idle");
      }, 2500);
    } finally {
      setIsAdding(false);
    }
  };

  const defaultClasses =
    "rounded px-3.5 py-1.5 text-xs font-bold text-white transition border-0 cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5 disabled:cursor-not-allowed";

  const statusClasses =
    addStatus === "success"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : "bg-[#d20b4f] hover:bg-[#b80943] text-white disabled:opacity-70";

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`${defaultClasses} ${statusClasses} ${className}`}
      title={typeof children === "string" ? children : "Add to Cart"}
    >
      {isAdding ? (
        <>
          <i className="fa fa-spinner fa-spin text-xs" />
          <span>{loadingText}</span>
        </>
      ) : addStatus === "success" ? (
        <>
          <i className="fa fa-check text-xs" />
          <span>{successText}</span>
        </>
      ) : (
        <>
          {showIcon && <i className="fa fa-shopping-basket text-xs" />}
          {children || <span>Add to Cart ({variant})</span>}
        </>
      )}
    </button>
  );
}
