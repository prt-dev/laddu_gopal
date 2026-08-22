import React, { useState } from "react";
import SearchInput from "./SearchInput";
import ThemeToggler from "./ThemeToggler";
import NotificationsMenu from "./NotificationsMenu";
import ProfileMenu from "./ProfileMenu";

interface HeaderProps {
  dark: boolean;
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
}

export default function Header({
  dark,
  onToggleTheme,
  onToggleMobileSidebar,
}: HeaderProps) {
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Mobile Hamburger Button */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={onToggleMobileSidebar}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        {/* Search Input */}
        <SearchInput />

        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme Toggler */}
          <li className="flex">
            <ThemeToggler dark={dark} onToggle={onToggleTheme} />
          </li>

          {/* Notifications Menu */}
          <NotificationsMenu
            isOpen={isNotificationsMenuOpen}
            onToggle={() => {
              setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
              setIsProfileMenuOpen(false);
            }}
            onClose={() => setIsNotificationsMenuOpen(false)}
          />

          {/* Profile Menu */}
          <ProfileMenu
            isOpen={isProfileMenuOpen}
            onToggle={() => {
              setIsProfileMenuOpen(!isProfileMenuOpen);
              setIsNotificationsMenuOpen(false);
            }}
            onClose={() => setIsProfileMenuOpen(false)}
          />
        </ul>
      </div>
    </header>
  );
}
