import React from "react";
import type { Metadata } from "next";
import ClientAddForm from "@/app/components/admin/ClientAddForm";

export const metadata: Metadata = {
  title: "Add Client | BlogVerse Admin",
  description: "Create and register a new client",
};

export default function AdminAddClientPage() {
  return <ClientAddForm />;
}
