"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface WebLayoutClientProps {
  children: React.ReactNode;
}

export default function WebLayoutClient({ children }: WebLayoutClientProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-['Bubblegum_Sans',cursive]">
      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#d20b4f] text-white shadow-lg transition hover:bg-[#b80943] border-0 cursor-pointer"
          title="Back to top"
          type="button"
        >
          <i className="fa fa-arrow-up text-sm"></i>
        </button>
      )}
    </div>
  );
}
