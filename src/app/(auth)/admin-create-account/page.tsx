import React from "react";
import CreateAccountPageComponent from "@/app/components/admin/CreateAccountPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Makhan Chor Admin Dashboard",
  description: "Create account page for Makhan Chor Admin Dashboard",
};


export default function AdminCreateAccountPage() {
  return <CreateAccountPageComponent />;
}
