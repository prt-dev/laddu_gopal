import React from "react";
import type { Metadata } from "next";
import ClientForm from "@/app/components/admin/ClientForm";

export const metadata: Metadata = {
  title: "Edit Client | BlogVerse Admin",
  description: "Update client details and domains",
};

export default function AdminEditClientFallbackPage() {
  return <ClientForm mode="edit" />;
}
