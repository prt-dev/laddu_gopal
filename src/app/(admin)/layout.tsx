import React from "react";
import AdminLayoutClient from "@/app/components/admin/AdminLayoutClient";
import ThemeScript from "@/app/components/admin/ThemeScript";
import type { Metadata } from "next";
import "@/app/admin.css";
import { AuthProvider } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/context/ProtectedRoute";

export const metadata: Metadata = {
  title: "Admin Dashboard | BlogVerse CMS",
  description: "BlogVerse Content Management System and Admin Portal",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </ProtectedRoute>
      <ThemeScript />
    </AuthProvider>
  );
}
