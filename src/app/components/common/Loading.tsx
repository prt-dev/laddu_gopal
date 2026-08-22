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
  const primaryColorClass = isWebTheme ? "text-success" : "text-purple-600 dark:text-purple-400";
  const borderSpinnerClass = isWebTheme
    ? "border-emerald-500 border-t-transparent"
    : "border-purple-600 border-t-transparent";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="relative flex items-center justify-center mb-4">
        {/* Outer glowing pulsing ring */}
        <div
          className={`absolute h-16 w-16 rounded-circle animate-ping opacity-25 ${
            isWebTheme ? "bg-success" : "bg-purple-500"
          }`}
        ></div>

        {/* Outer Spinner Ring */}
        <div
          className={`h-12 w-12 rounded-circle border-4 border-solid animate-spin ${borderSpinnerClass}`}
          style={{ borderTopColor: "transparent" }}
        ></div>

        {/* Center Icon */}
        <div className={`absolute ${primaryColorClass}`}>
          <i className={`fas ${isWebTheme ? "fa-seedling" : "fa-shield-alt"} fa-sm`}></i>
        </div>
      </div>

      {/* Loading Text */}
      <p className={`text-sm font-semibold tracking-wide animate-pulse ${primaryColorClass}`}>
        {message}
      </p>
    </div>
  );
}
