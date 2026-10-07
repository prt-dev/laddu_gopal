import type { Metadata } from "next";
import WebLayoutClient from "@/components/web/WebLayoutClient";
import "../web.css";
import { siteConfig } from "@/config/site";
import { WebAuthProvider } from "@/context/web/WebAuthContext";
import { CartProvider } from "@/context/web/CartContext";
import { GeneralProvider } from "@/context/web/GeneralContext";
import WebProtectedRoute from "@/context/web/WebProtectedRoute";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
};

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WebAuthProvider>
      <CartProvider>
        <GeneralProvider>
          <WebProtectedRoute>
            {/* FontAwesome and Bootstrap Icons */}
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
        </GeneralProvider>
      </CartProvider>
    </WebAuthProvider>
  );
}
