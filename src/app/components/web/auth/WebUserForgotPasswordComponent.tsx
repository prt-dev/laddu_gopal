"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/app/config/site";

export default function WebUserForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="w-100 px-3" style={{ maxWidth: "480px" }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="card-body p-4 p-sm-5 bg-white">
          <div className="text-center mb-4">
            <Link href="/" className="d-inline-block mb-3 text-decoration-none">
              <span className="h3 fw-bold text-primary mb-0">{siteConfig.name}</span>
            </Link>
            <h4 className="fw-bold text-dark mb-1">Reset Password</h4>
            <p className="text-muted small">Enter your email and we'll send reset instructions</p>
          </div>

          {isSubmitted ? (
            <div className="alert alert-success text-center p-3 rounded-3" role="alert">
              <i className="fas fa-check-circle fa-2x mb-2 d-block text-success"></i>
              <strong>Reset Link Sent!</strong>
              <p className="small mb-0 mt-1">If an account exists for {email}, a password reset link has been emailed.</p>
              <Link href="/login" className="btn btn-outline-success btn-sm mt-3 fw-bold">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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

              <button type="submit" className="btn btn-primary w-100 py-2.5 rounded-pill fw-bold text-white shadow-sm">
                <i className="fas fa-paper-plane me-2"></i> Send Reset Link
              </button>
            </form>
          )}

          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              Remembered your password?{" "}
              <Link href="/login" className="text-primary fw-bold text-decoration-none ms-1">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
