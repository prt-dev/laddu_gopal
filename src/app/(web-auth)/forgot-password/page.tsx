import React from "react";
import WebUserForgotPasswordComponent from "@/app/components/web/auth/WebUserForgotPasswordComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | BlogVerse",
  description: "Reset your BlogVerse account password.",
};

export default function WebUserForgotPasswordPage() {
  return <WebUserForgotPasswordComponent />;
}
