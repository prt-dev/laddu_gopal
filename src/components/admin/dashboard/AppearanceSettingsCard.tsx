import React from "react";

export default function AppearanceSettingsCard() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6 sm:p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Appearance
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customize the look and feel of the application.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Theme Mode
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Light Mode */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 border-2 border-purple-600 cursor-pointer">
            <div className="h-16 w-full bg-white rounded-lg shadow-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Light</span>
              <span className="text-purple-600 font-bold text-sm">✓</span>
            </div>
          </div>

          {/* Dark Mode */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-purple-500 cursor-pointer">
            <div className="h-16 w-full bg-gray-900 rounded-lg shadow-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Dark</span>
            </div>
          </div>

          {/* System Mode */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-purple-500 cursor-pointer">
            <div className="h-16 w-full bg-gradient-to-r from-white to-gray-900 rounded-lg shadow-sm flex items-center justify-center">
              <span className="text-xs font-bold text-purple-600 bg-white px-2 py-1 rounded">Auto</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">System</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
