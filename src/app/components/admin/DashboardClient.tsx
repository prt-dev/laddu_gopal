"use client";

import Dashcards from "@/app/components/admin/Dashcards";
import ChartCard from "@/app/components/admin/ChartCard";
import { ClientItem } from "@/app/services/userService";
import UserList from "./UserList";

const initialClients: ClientItem[] = [
  {
    name: "Hans Burger",
    title: "10x Developer",
    amount: "$ 863.45",
    status: "Approved",
    statusBadge: "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100",
    date: "6/10/2020",
    avatar: "https://images.unsplash.com/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max",
  },
  {
    name: "Jolina Angelie",
    title: "Unemployed",
    amount: "$ 369.95",
    status: "Pending",
    statusBadge: "text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600",
    date: "6/10/2020",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200",
  },
  {
    name: "Sarah Curry",
    title: "Designer",
    amount: "$ 86.00",
    status: "Denied",
    statusBadge: "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700",
    date: "6/10/2020",
    avatar: "https://images.unsplash.com/photo-1551069613-1904dbdcda11?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200",
  },
  {
    name: "Rulia Joberts",
    title: "Actress",
    amount: "$ 1276.45",
    status: "Approved",
    statusBadge: "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100",
    date: "6/10/2020",
    avatar: "https://images.unsplash.com/photo-1551006917-3b4c078c47c9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200",
  },
  {
    name: "Wenzel Dashington",
    title: "Actor",
    amount: "$ 863.45",
    status: "Expired",
    statusBadge: "text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700",
    date: "6/10/2020",
    avatar: "https://images.unsplash.com/photo-1546456073-6712f79251bb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200",
  },
  {
    name: "Dave Li",
    title: "Influencer",
    amount: "$ 863.45",
    status: "Approved",
    statusBadge: "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100",
    date: "6/10/2020",
    avatar: "https://images.unsplash.com/photo-1502720705749-871143f0e671?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200",
  },
  {
    name: "Maria Ramovic",
    title: "Runner",
    amount: "$ 863.45",
    status: "Approved",
    statusBadge: "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100",
    date: "6/10/2020",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200",
  },
  {
    name: "Hitney Wouston",
    title: "Singer",
    amount: "$ 863.45",
    status: "Approved",
    statusBadge: "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100",
    date: "6/10/2020",
    avatar: "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200",
  },
];

export default function DashboardClient() {

  return (
    <>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Dashboard
      </h2>

      {/* Metric Stat Cards Grid */}
      <Dashcards />

      {/* Data Table Component */}
      {/* <DataTable data={clientsData} /> */}

      <UserList />

      {/* Charts Section */}
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Charts
      </h2>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard
          title="Revenue"
          chartId="pie"
          chartPlaceholder="Revenue Distribution Chart (Pie)"
          legends={[
            { color: "bg-blue-500", label: "Shirts" },
            { color: "bg-teal-600", label: "Shoes" },
            { color: "bg-purple-600", label: "Bags" },
          ]}
        />

        <ChartCard
          title="Traffic"
          chartId="line"
          chartPlaceholder="Traffic Trends Chart (Line)"
          legends={[
            { color: "bg-teal-600", label: "Organic" },
            { color: "bg-purple-600", label: "Paid" },
          ]}
        />
      </div>
    </>
  );
}
