import React from "react";
import AdminLayoutClient from "@/components/admin/layout/AdminLayoutClient";
import ThemeScript from "@/components/admin/layout/ThemeScript";
import type { Metadata } from "next";
import "@/app/admin.css";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/context/ProtectedRoute";

export const metadata: Metadata = {
  title: "Admin Dashboard | Makhan Chor CMS",
  description: "Makhan Chor Store Content Management System and Admin Portal",
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
