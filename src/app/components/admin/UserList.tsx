"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/app/components/admin/DataTable";
import { ClientItem, getUsers } from "@/app/services/userService";
import { useAuth } from "@/app/context/AuthContext";

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
        <span>Loading users...</span>
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

  return <DataTable data={usersList} />;
}
