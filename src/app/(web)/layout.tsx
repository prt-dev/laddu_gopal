import type { Metadata } from "next";
import WebLayoutClient from "../components/web/WebLayoutClient";
import "../web.css";
import { siteConfig } from "../config/site";
import { WebAuthProvider } from "../context/WebAuthContext";
import WebProtectedRoute from "../context/WebProtectedRoute";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: "Read inspiring stories, expert technology tutorials, creative writing, and publish your own blogs on BlogVerse.",
  icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebAuthProvider>
      <WebProtectedRoute>
        {/* Head Stylesheet Links */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
        />
        <link rel="stylesheet" href="/assets/lib/owlcarousel/assets/owl.carousel.min.css" />
        <link rel="stylesheet" href="/assets/lib/lightbox/css/lightbox.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />

        <WebLayoutClient>{children}</WebLayoutClient>
      </WebProtectedRoute>
    </WebAuthProvider>
  );
}
