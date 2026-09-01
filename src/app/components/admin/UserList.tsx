"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/app/components/admin/DataTable";
import { ClientItem, getUsers } from "@/app/services/userService";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/common/Loading";

export default function UserList() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const [usersList, setUsersList] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async (authToken: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUsers({}, authToken);
        if (Array.isArray(data)) {
          setUsersList(data);
        } else if (data?.items && Array.isArray(data.items)) {
          setUsersList(data.items);
        } else if (data?.users && Array.isArray(data.users)) {
          setUsersList(data.users);
        } else {
          setUsersList([]);
        }
      } catch (err: any) {
        console.error("Failed to load users:", err);
        setError(err?.message || "Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadUsers(token);
    } else if (!isAuthLoading && !token) {
      setIsLoading(false);
    }
  }, [token, isAuthLoading]);

  if (isLoading) {
    return <Loading variant="container" size="md" message="Loading users..." />;
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  return <DataTable data={usersList} />;
}
