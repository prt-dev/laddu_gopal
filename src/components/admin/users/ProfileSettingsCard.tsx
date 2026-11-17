import React from "react";

export default function ProfileSettingsCard() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xs p-6 sm:p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Profile Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update your personal details and public profile.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer">
          <img
            className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-purple-500"
            src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
            alt="Profile Avatar"
          />
        </div>
        <div className="flex flex-col gap-2">
          <button className="px-4 py-2 bg-purple-600 text-white font-medium text-sm rounded-lg hover:bg-purple-700 transition-colors w-fit">
            Change Picture
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, GIF or PNG. Max size of 800KB.
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              defaultValue="Executive"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg px-4 py-2.5 border-0 focus:outline-none focus:border-purple-500 form-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              defaultValue="Admin"
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg px-4 py-2.5 border-0 focus:outline-none focus:border-purple-500 form-input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            defaultValue="admin@lumina.io"
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg px-4 py-2.5 border-0 focus:outline-none focus:border-purple-500 form-input"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="px-6 py-2.5 bg-purple-600 text-white font-medium text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}
