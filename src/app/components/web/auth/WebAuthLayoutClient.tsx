"use client";

import React from "react";
import TemplateScript from "@/app/components/web/TemplateScript";

interface WebAuthLayoutClientProps {
  children: React.ReactNode;
}

export default function WebAuthLayoutClient({ children }: WebAuthLayoutClientProps) {
  return (
    <div className="web-auth-layout-root">
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        {children}
      </main>

      {/* Template script initializer */}
      <TemplateScript />
    </div>
  );
}
