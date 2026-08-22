import React from "react";
import LoginPageComponent from "@/app/components/admin/LoginPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | BlogVerse",
  description: "BlogVerse Admin Dashboard Login",
};

export default function AdminPage() {
  return <LoginPageComponent />;
}
