"use client";

import React, { useEffect, useState } from "react";
import ClientTable from "@/app/components/admin/ClientTable";
import { ClientItem, getClients, deleteClientApi } from "@/app/services/clientService";
import { useAuth } from "@/app/context/AuthContext";

export default function ClientList() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const [clientsList, setClientsList] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async (authToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getClients({}, authToken);
      if (Array.isArray(data)) {
        setClientsList(data);
      } else if (data?.items && Array.isArray(data.items)) {
        setClientsList(data.items);
      } else if (data?.clients && Array.isArray(data.clients)) {
        setClientsList(data.clients);
      } else {
        setClientsList([]);
      }
    } catch (err: any) {
      console.error("Failed to load clients:", err);
      setError(err?.message || "Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadClients(token);
    } else if (!isAuthLoading && !token) {
      setIsLoading(false);
    }
  }, [token, isAuthLoading]);

  const handleDelete = async (client: ClientItem) => {
    if (!client.id || !token) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete client "${client.name}"?`
    );
    if (!confirmed) return;

    try {
      await deleteClientApi(client.id, token);
      await loadClients(token);
    } catch (err: any) {
      alert(err?.message || "Failed to delete client.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <svg
          className="w-6 h-6 mr-3 animate-spin text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Loading clients...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  return <ClientTable data={clientsList} onDelete={handleDelete} />;
}
