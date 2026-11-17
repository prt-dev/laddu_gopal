import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/web/layout/PageHeader";

export const metadata: Metadata = {
  title: "My Account | Makkanchor",
  description: "Devotee account dashboard and orders.",
};

export default function UserProfilePage() {
  return (
    <>
      <PageHeader
        title="My Account"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account" },
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 border border-amber-100 text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
            <i className="fa fa-user"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Devotee Portal</h2>
          <p className="text-gray-600 mb-6">
            Welcome to your sacred account. View your recent orders, manage delivery addresses, and update your profile.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/cart"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
            >
              View Basket
            </Link>
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
