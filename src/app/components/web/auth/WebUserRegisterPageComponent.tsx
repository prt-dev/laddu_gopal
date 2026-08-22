"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { isValidEmail } from "@/app/utils/utils";
import { siteConfig } from "@/app/config/site";

export default function WebUserRegisterPageComponent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const router = useRouter();
  const { login, register } = useWebAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || fullName.length < 4) {
      alert("Enter a valid Full Name!");
    }

    if (!isValidEmail(email)) {
      alert("Enter a valid Email!");
    }

    if (!password || password.length < 6 || !confirmPassword || confirmPassword.length < 6) {
      alert('Password requirement is not fullfiled!');
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreeTerms) {
      alert("Please accept the terms and conditions.");
      return;
    }



    register({
      name: fullName || (email ? email.split("@")[0] : "Customer"),
      email: email,
      password: password,
    });

  };

  return (
    <div className="w-100 px-3" style={{ maxWidth: "540px" }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="card-body p-4 p-sm-5 bg-white">
          <div className="text-center mb-4">
            <Link href="/" className="d-inline-block mb-3 text-decoration-none">
              <span className="h3 fw-bold text-primary mb-0">{siteConfig.name}</span>
            </Link>
            <h4 className="fw-bold text-dark mb-1">Create BlogVerse Account</h4>
            <p className="text-muted small">Join our community of readers, writers, and thinkers</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-dark font-weight-bold small">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted border-end-0">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

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

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-dark font-weight-bold small">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted border-end-0">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-0"
                    placeholder="At least 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label text-dark font-weight-bold small">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted border-end-0">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-0"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="termsCheck"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label className="form-check-label text-muted small cursor-pointer" htmlFor="termsCheck">
                I agree to the <a href="#" className="text-primary text-decoration-underline">Terms of Service</a> & <a href="#" className="text-primary text-decoration-underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2.5 rounded-pill fw-bold text-white shadow-sm">
              <i className="fas fa-user-check me-2"></i> Register Account
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              Already have an account?{" "}
              <Link href="/login" className="text-primary fw-bold text-decoration-none ms-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
