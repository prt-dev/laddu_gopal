import React from "react";
import SettingsSidebarNav from "@/app/components/admin/SettingsSidebarNav";
import ProfileSettingsCard from "@/app/components/admin/ProfileSettingsCard";
import AppearanceSettingsCard from "@/app/components/admin/AppearanceSettingsCard";
import NotificationsSettingsCard from "@/app/components/admin/NotificationsSettingsCard";

export default function AdminSettingsPage() {
  return (
    <>
      <div className="flex flex-col gap-2 my-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Settings
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your account preferences, appearance, and notification settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
        {/* Settings Sidebar Nav Component */}
        <SettingsSidebarNav />

        {/* Main Settings Sections */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          {/* Profile Settings Card Component */}
          <ProfileSettingsCard />

          {/* Appearance Settings Card Component */}
          <AppearanceSettingsCard />

          {/* Notifications Settings Card Component */}
          <NotificationsSettingsCard />
        </div>
      </div>
    </>
  );
}
