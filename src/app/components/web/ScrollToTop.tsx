"use client";

import React, { useState, useEffect } from "react";
import { handleScroll, scrollToTop } from "@/utils/web/utils";

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export default function ScrollToTop({
  threshold = 300,
  className = "",
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => handleScroll(setIsVisible, threshold);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => scrollToTop()}
      className={`fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#d20b4f] text-white shadow-lg transition hover:bg-[#b80943] border-0 cursor-pointer ${className}`}
      title="Back to top"
      type="button"
      aria-label="Back to top"
    >
      <i className="fa fa-arrow-up text-sm"></i>
    </button>
  );
}
