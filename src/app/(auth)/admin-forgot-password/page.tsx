import React from "react";
import ForgotPasswordPageComponent from "@/app/components/admin/ForgotPasswordPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | BlogVerse Admin Dashboard",
  description: "Forgot password recovery page for BlogVerse Admin Dashboard",
};

export default function AdminForgotPasswordPage() {
  return <ForgotPasswordPageComponent />;
}
