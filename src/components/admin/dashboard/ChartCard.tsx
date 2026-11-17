import React from "react";

export interface LegendItem {
  color: string;
  label: string;
}

interface ChartCardProps {
  title: string;
  chartId?: string;
  chartPlaceholder?: string;
  legends: LegendItem[];
}

export default function ChartCard({
  title,
  chartId,
  chartPlaceholder,
  legends,
}: ChartCardProps) {
  return (
    <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
        {title}
      </h4>
      {chartId ? (
        <canvas id={chartId}></canvas>
      ) : (
        <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 font-medium text-sm">
          {chartPlaceholder}
        </div>
      )}
      <div className="flex justify-center mt-4 space-x-3 text-sm text-gray-600 dark:text-gray-400">
        {legends.map((legend, idx) => (
          <div key={idx} className="flex items-center">
            <span className={`inline-block w-3 h-3 mr-1 ${legend.color} rounded-full`}></span>
            <span>{legend.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
