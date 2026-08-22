import React from "react";
import type { Metadata } from "next";
import ClientForm from "@/app/components/admin/ClientForm";

export const metadata: Metadata = {
  title: "Edit Client | BlogVerse Admin",
  description: "Update client details and domains",
};

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  return <ClientForm mode="edit" clientId={id} />;
}
