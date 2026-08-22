import type { Metadata } from "next";
import DashboardClient from "@/app/components/admin/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | BlogVerse Admin",
  description: "BlogVerse Admin Dashboard main view",
};

export default function AdminDashboardPage() {
  return <DashboardClient />;
}
