import React from "react";
import LoginPageComponent from "@/app/components/admin/LoginPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | BlogVerse Admin Dashboard",
  description: "Login page for BlogVerse Admin Dashboard",
};

export default function AdminLoginPage() {
  return <LoginPageComponent />;
}
