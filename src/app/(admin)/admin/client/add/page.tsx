import React from "react";
import type { Metadata } from "next";
import ClientAddForm from "@/components/admin/clients/ClientAddForm";

export const metadata: Metadata = {
  title: "Add Client | Makhan Chor Admin",
  description: "Create and register a new client",
};


export default function AdminAddClientPage() {
  return <ClientAddForm />;
}
