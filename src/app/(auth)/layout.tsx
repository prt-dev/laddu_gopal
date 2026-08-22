import React from "react";
import ThemeScript from "@/app/components/admin/ThemeScript";
import type { Metadata } from "next";
import "@/app/admin.css";
import { AuthProvider } from "@/app/context/AuthContext";
import ProtectedRoute from "../context/ProtectedRoute";

export const metadata: Metadata = {
  title: "Admin Portal | BlogVerse",
  description: "Admin authentication portal for BlogVerse Content Management System",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </AuthProvider>
  );
}
