import React from "react";
import WebUserForgotPasswordComponent from "@/app/components/web/auth/WebUserForgotPasswordComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Makhan Chor",
  description: "Reset your Makhan Chor devotee account password.",
};


export default function WebUserForgotPasswordPage() {
  return <WebUserForgotPasswordComponent />;
}
