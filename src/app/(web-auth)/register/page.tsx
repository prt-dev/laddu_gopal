import React from "react";
import WebUserRegisterPageComponent from "@/app/components/web/auth/WebUserRegisterPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | BlogVerse",
  description: "Register a new account at BlogVerse to publish articles, bookmark stories, and connect with writers.",
};

export default function WebUserRegisterPage() {
  return <WebUserRegisterPageComponent />;
}
