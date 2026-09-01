"use client";

import React from "react";

export interface SaveDetailsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  loading?: boolean;
}

export default function SaveDetailsButton({
  type = "button",
  label = "Save Address",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: SaveDetailsButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`rounded bg-[#d20b4f] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#b80943] cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? "Saving..." : children || label}
    </button>
  );
}
