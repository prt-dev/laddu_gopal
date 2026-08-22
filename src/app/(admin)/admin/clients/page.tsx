import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ClientList from "@/app/components/admin/ClientList";

export const metadata: Metadata = {
  title: "Clients | BlogVerse Admin",
  description: "Manage client brands and domains",
};

export default function AdminClientsPage() {
  return (
    <>
      <div className="flex items-center justify-between my-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Clients & Domains
        </h2>
        <Link
          href="/admin/client/add"
          className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple transition-colors"
        >
          + Add New Client
        </Link>
      </div>

      <ClientList />
    </>
  );
}
