import type { Metadata } from "next";
import DashboardClient from "@/components/admin/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Makhan Chor Admin",
  description: "Makhan Chor Admin Dashboard main view",
};


export default function AdminDashboardPage() {
  return <DashboardClient />;
}
