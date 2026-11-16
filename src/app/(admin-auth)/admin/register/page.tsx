import React from "react";
import CreateAccountPageComponent from "@/components/admin/auth/CreateAccountPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Makhan Chor Admin Dashboard",
  description: "Create account page for Makhan Chor Admin Dashboard",
};

export default function AdminRegisterPage() {
  return <CreateAccountPageComponent />;
}
