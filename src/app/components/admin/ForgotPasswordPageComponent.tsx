"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPageComponent() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert(`Password recovery email sent to: ${email}`);
    } catch (err: any) {
      alert(err?.message || "Failed to send recovery email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* Left Image Section */}
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src="/admin/assets/img/forgot-password-office.jpeg"
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src="/admin/assets/img/forgot-password-office-dark.jpeg"
              alt="Office"
            />
          </div>

          {/* Right Form Section */}
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Forgot password
              </h1>

              <form onSubmit={handleSubmit}>
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Email</span>
                  <input
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input py-2 px-3 border border-gray-300 rounded-md disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:opacity-75"
                    placeholder="Jane Doe"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center justify-center gap-2 w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 rounded-lg ${
                    isSubmitting
                      ? "bg-purple-400 cursor-not-allowed opacity-75"
                      : "bg-purple-600 border border-transparent active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple cursor-pointer"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Sending link...</span>
                    </>
                  ) : (
                    "Recover password"
                  )}
                </button>
              </form>

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  href="/admin-login"
                >
                  Remember your password? Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
