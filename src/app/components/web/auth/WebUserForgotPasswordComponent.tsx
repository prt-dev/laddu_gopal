"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/app/config/site";
import { isValidEmail } from "@/app/utils/utils";

export default function WebUserForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <div className="w-full px-3 mx-auto" style={{ maxWidth: "440px" }}>
      <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-2 no-underline">
            <img src="/assets/logo.png" alt={siteConfig.name} className="w-32 h-auto mx-auto" />
          </Link>
          <h2 className="heading-font text-xl font-bold text-[#d20b4f] mb-1">
            Reset Password
          </h2>
          <p className="text-xs font-bold text-black">
            Enter your email to receive a password reset link
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded bg-white p-4 text-center border border-gray-200">
            <p className="text-xs font-bold text-black mb-3">
              We have sent password reset instructions to <strong>{email}</strong>.
            </p>
            <Link
              href="/login"
              className="rounded bg-[#d20b4f] px-5 py-1.5 text-xs font-bold text-black transition hover:bg-[#b80943] no-underline inline-block"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

            <button
              type="submit"
              className="w-full rounded bg-[#d20b4f] py-2 text-sm font-bold text-black transition hover:bg-[#b80943] border-0 cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center mt-6 pt-4 border-t border-[#d20b4f]/20">
          <p className="text-xs font-bold text-black mb-0">
            Remember your password?{" "}
            <Link href="/login" className="text-[#d20b4f] font-bold no-underline ml-1">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
