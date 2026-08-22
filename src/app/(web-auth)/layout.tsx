import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "@/app/web.css";
import { siteConfig } from "@/app/config/site";
import { WebAuthProvider } from "@/app/context/WebAuthContext";
import WebAuthLayoutClient from "@/app/components/web/auth/WebAuthLayoutClient";
import WebProtectedRoute from "@/app/context/WebProtectedRoute";

export const metadata: Metadata = {
  title: "Reader & Author Portal | " + siteConfig.name,
  description: "Sign in or register for a BlogVerse account to bookmark stories, write blogs, and engage with the community.",
};

export default function WebAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebAuthProvider>
      <WebProtectedRoute>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
        />
        <link rel="stylesheet" href="/assets/css/style.css" />

        {/* jQuery - Server Layout Script */}
        <Script
          id="jquery"
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js"
          strategy="afterInteractive"
        />
        {/* Bootstrap JS */}
        <Script
          id="bootstrap-js"
          src="/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />

        <WebAuthLayoutClient>{children}</WebAuthLayoutClient>
      </WebProtectedRoute>
    </WebAuthProvider>
  );
}
