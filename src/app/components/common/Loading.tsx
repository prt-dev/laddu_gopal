"use client";

import React from "react";

interface LoadingProps {
  message?: string;
  variant?: "web" | "admin" | "fullscreen";
}

export default function Loading({
  message = "Loading...",
  variant = "fullscreen",
}: LoadingProps) {
  const isWebTheme = variant === "web";
  const bgClass = isWebTheme
    ? "bg-white"
    : "bg-white dark:bg-gray-900";
  const textClass = isWebTheme
    ? "text-[#d20b4f]"
    : "text-[#d20b4f] dark:text-[#f3a6be]";

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center p-4 transition-colors duration-300 ${bgClass}`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center mb-3">
          {/* Soft background glow behind logo without rotation */}
          <div className="absolute -inset-3 rounded-full bg-[#fff0ad]/60 dark:bg-[#fff0ad]/20 animate-pulse blur-md" />
          <img
            src="/assets/logo.png"
            alt="Makhan Chor"
            className="relative w-28 h-auto object-contain animate-pulse"
          />
        </div>

        {/* Loading Text */}
        {message && (
          <p
            className={`text-xs font-bold tracking-wider uppercase animate-pulse mt-2 ${textClass}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}


