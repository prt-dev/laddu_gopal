"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { siteConfig } from "@/app/config/site";
import { isValidEmail } from "@/app/utils/utils";

export default function WebUserLoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useWebAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Enter a valid Email!");
    }

    if (!password || password.length < 6) {
      alert('Password requirement is not fullfiled!');
      return;
    }

    login({
      email: email,
      password: password,
    });

    // router.push("/");
  };

  // useEffect(() => {
  //   if (!isLoading && isAuthenticated) {
  //     router.push("/");
  //   }
  // }, [isLoading, isAuthenticated, router]);

  return (
    <div className="w-100 px-3" style={{ maxWidth: "480px" }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="card-body p-4 p-sm-5 bg-white">
          <div className="text-center mb-4">
            <Link href="/" className="d-inline-block mb-3 text-decoration-none">
              <span className="h3 fw-bold text-primary mb-0">{siteConfig.name}</span>
            </Link>
            <h4 className="fw-bold text-dark mb-1">Reader &amp; Author Login</h4>
            <p className="text-muted small">Sign in to your BlogVerse reader or author account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label text-dark font-weight-bold small">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted border-end-0">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label text-dark font-weight-bold mb-0 small">Password</label>
                <Link href="/forgot-password" className="text-primary small text-decoration-none">
                  Forgot password?
                </Link>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted border-end-0">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-check mb-4 !hidden">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberCheck"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label text-muted small cursor-pointer" htmlFor="rememberCheck">
                Remember me on this device
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2.5 rounded-pill fw-bold text-white shadow-sm">
              <i className="fas fa-sign-in-alt me-2"></i> Log In
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary fw-bold text-decoration-none ms-1">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
