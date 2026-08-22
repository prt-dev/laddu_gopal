import React from "react";

export default function NotificationsSettingsCard() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6 sm:p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Notifications
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose how you want to be notified about activity.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Email Preferences
          </h4>
          <label className="flex items-start gap-4 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 form-checkbox text-purple-600 rounded" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Daily Summary</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Receive a daily summary of all activity and reports.</span>
            </div>
          </label>
          <label className="flex items-start gap-4 cursor-pointer">
            <input type="checkbox" className="mt-1 form-checkbox text-purple-600 rounded" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Security Alerts</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Get notified immediately about any suspicious activity.</span>
            </div>
          </label>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Push Notifications
          </h4>
          <label className="flex items-start gap-4 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 form-checkbox text-purple-600 rounded" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Direct Messages</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Notifications for incoming messages from team members.</span>
            </div>
          </label>
          <label className="flex items-start gap-4 cursor-pointer">
            <input type="checkbox" defaultChecked className="mt-1 form-checkbox text-purple-600 rounded" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">System Updates</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Important announcements regarding platform maintenance.</span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
