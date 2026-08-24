import React from "react";
import WebUserLoginPageComponent from "@/app/components/web/auth/WebUserLoginPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Makhan Chor",
  description: "Sign in to your Makhan Chor devotee account to manage your orders and seva.",
};


export default function WebUserLoginPage() {
  return <WebUserLoginPageComponent />;
}
