import React from "react";
import CreateAccountPageComponent from "@/app/components/admin/CreateAccountPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | BlogVerse Admin Dashboard",
  description: "Create account page for BlogVerse Admin Dashboard",
};

export default function AdminCreateAccountPage() {
  return <CreateAccountPageComponent />;
}
