"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

interface WebLayoutClientProps {
  children: React.ReactNode;
}

export default function WebLayoutClient({ children }: WebLayoutClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-['Bubblegum_Sans',cursive]">
      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <ScrollToTop />
    </div>
  );
}
