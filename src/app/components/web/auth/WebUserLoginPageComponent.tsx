"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { siteConfig } from "@/app/config/site";
import { isValidEmail } from "@/app/utils/utils";

export default function WebUserLoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useWebAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isValidEmail(email)) {
      alert("Enter a valid Email!");
      return;
    }

    if (!password || password.length < 6) {
      alert("Password requirement is not fulfilled!");
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: email,
        password: password,
      });
    } catch (err: any) {
      alert(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-3 mx-auto" style={{ maxWidth: "440px" }}>
      <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-2 no-underline">
            <img src="/assets/logo.png" alt={siteConfig.name} className="w-32 h-auto mx-auto" />
          </Link>
          <h2 className="heading-font text-xl font-bold text-[#d20b4f] mb-1">
            Devotee Account Login
          </h2>
          <p className="text-xs font-bold text-black">
            Sign in to view orders and manage sacred seva
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1">Email Address</label>
            <input
              type="email"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden disabled:bg-gray-100 disabled:opacity-75"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-black">Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-[#d20b4f] no-underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden disabled:bg-gray-100 disabled:opacity-75"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded py-2.5 text-sm font-bold border-0 transition flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed opacity-75 shadow-none"
                : "bg-[#d20b4f] text-white hover:bg-[#b80943] cursor-pointer shadow-xs"
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Signing In...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-[#d20b4f]/20">
          <p className="text-xs font-bold text-black mb-0">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#d20b4f] font-bold no-underline ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

