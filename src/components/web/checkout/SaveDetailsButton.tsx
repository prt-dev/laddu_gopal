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
      className={`inline-flex items-center justify-center gap-1.5 rounded bg-[#d20b4f] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#b80943] cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="h-3.5 w-3.5 animate-spin text-white"
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
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading ? "Saving Address..." : children || label}
    </button>
  );
}
