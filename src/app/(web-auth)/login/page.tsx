import React from "react";
import WebUserLoginPageComponent from "@/app/components/web/auth/WebUserLoginPageComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | BlogVerse",
  description: "Sign in to your BlogVerse account to manage your stories, bookmarks, and author profile.",
};

export default function WebUserLoginPage() {
  return <WebUserLoginPageComponent />;
}
