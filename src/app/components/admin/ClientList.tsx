"use client";

import React, { useEffect, useState } from "react";
import ClientTable from "@/app/components/admin/ClientTable";
import { ClientItem, getClients, deleteClientApi } from "@/app/services/clientService";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/common/Loading";

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
    return <Loading variant="container" size="md" message="Loading clients..." />;
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
