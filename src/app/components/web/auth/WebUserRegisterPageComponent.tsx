"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/app/config/site";
import { isValidEmail } from "@/app/utils/utils";

export default function WebUserRegisterPageComponent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Account registration successful! Please log in.");
    window.location.href = "/login";
  };

  return (
    <div className="w-full px-3 mx-auto" style={{ maxWidth: "440px" }}>
      <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-2 no-underline">
            <img src="/assets/logo.png" alt={siteConfig.name} className="w-32 h-auto mx-auto" />
          </Link>
          <h2 className="heading-font text-xl font-bold text-[#d20b4f] mb-1">
            Create Devotee Account
          </h2>
          <p className="text-xs font-bold text-black">
            Join the Makhan Chor seva community
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-black mb-1">Full Name</label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden"
              placeholder="e.g. Radhika Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Email Address</label>
            <input
              type="email"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-[#d20b4f] py-2 text-sm font-bold text-black transition hover:bg-[#b80943] border-0 cursor-pointer mt-2"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-[#d20b4f]/20">
          <p className="text-xs font-bold text-black mb-0">
            Already have an account?{" "}
            <Link href="/login" className="text-[#d20b4f] font-bold no-underline ml-1">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
