import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  iconTextColor,
}: StatCardProps) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <div className={`p-3 mr-4 ${iconTextColor} ${iconBgColor} rounded-full`}>
        {icon}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {value}
        </p>
      </div>
    </div>
  );
}
