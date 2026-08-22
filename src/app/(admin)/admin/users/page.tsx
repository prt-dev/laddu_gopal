import React from "react";
import type { Metadata } from "next";
import UserList from "@/app/components/admin/UserList";

export const metadata: Metadata = {
  title: "Users | BlogVerse Admin",
  description: "Manage users and client tables",
};

export default function AdminUsersPage() {
  return (
    <>
      <div className="flex items-center justify-between my-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Users & Client Tables
        </h2>
        <button className="px-4 py-2 text-sm font-medium leading-5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
          + Add New User
        </button>
      </div>

      <UserList />
    </>
  );
}
