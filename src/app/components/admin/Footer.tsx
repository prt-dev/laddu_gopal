import React from "react";

export default function Footer() {
  return (
    <footer className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400 mt-auto">
      &copy; {new Date().getFullYear()}{" "}
      <span className="font-semibold text-purple-600 dark:text-purple-400">BlogVerse</span>
      . All rights reserved.
    </footer>
  );
}
