import React from "react";
import WebUserRegisterPageComponent from "@/app/components/web/auth/WebUserRegisterPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Makhan Chor",
  description: "Register a new devotee account at Makhan Chor to manage orders and seva.",
};


export default function WebUserRegisterPage() {
  return <WebUserRegisterPageComponent />;
}
