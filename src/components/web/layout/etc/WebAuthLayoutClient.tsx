"use client";

import React from "react";

interface WebAuthLayoutClientProps {
  children: React.ReactNode;
}

export default function WebAuthLayoutClient({ children }: WebAuthLayoutClientProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff0ad]/20 py-12 px-4 font-['Bubblegum_Sans',cursive]">
      <main className="w-full flex items-center justify-center">{children}</main>
    </div>
  );
}
