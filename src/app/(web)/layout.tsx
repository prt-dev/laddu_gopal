import type { Metadata } from "next";
import WebLayoutClient from "../components/web/WebLayoutClient";
import "../web.css";
import { siteConfig } from "../config/site";
import { WebAuthProvider } from "../context/WebAuthContext";
import { CartProvider } from "../context/CartContext";
import WebProtectedRoute from "../context/WebProtectedRoute";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: "Makhan Chor - Supplying handcrafted Laddu Gopal Poshak, Pagdi, Kundan Shringar and devotional accessories all over the globe to Krishna Bhakts.",
  icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebAuthProvider>
      <CartProvider>
        <WebProtectedRoute>
          {/* Head Stylesheet Links */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          />

          <WebLayoutClient>{children}</WebLayoutClient>
        </WebProtectedRoute>
      </CartProvider>
    </WebAuthProvider>
  );
}

