import React from "react";
import type { Metadata } from "next";
import "@/app/web.css";
import { siteConfig } from "@/app/config/site";
import { WebAuthProvider } from "@/app/context/WebAuthContext";
import WebAuthLayoutClient from "@/app/components/web/auth/WebAuthLayoutClient";
import WebProtectedRoute from "@/app/context/WebProtectedRoute";

export const metadata: Metadata = {
  title: "Devotee Portal | " + siteConfig.name,
  description: "Sign in or register for a Makhan Chor account to manage orders and seva.",
};

export default function WebAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebAuthProvider>
      <WebProtectedRoute>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
        />

        <WebAuthLayoutClient>{children}</WebAuthLayoutClient>
      </WebProtectedRoute>
    </WebAuthProvider>
  );
}
