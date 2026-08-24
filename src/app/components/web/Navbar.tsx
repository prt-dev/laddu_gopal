"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "../../config/site";
import { useWebAuth } from "@/app/context/WebAuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useWebAuth();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="bg-[#fff0ad] sticky top-0 z-50 shadow-xs">
        <div className="mx-auto flex h-[70px] max-w-[1100px] items-center justify-between px-5">
          {/* Logo */}
          <Link
            href="/"
            className="heading-font text-center text-[13px] leading-[11px] text-[#d20b4f] no-underline"
          >
            <img src="/assets/logo.png" alt="Logo" className="w-22 h-auto" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#d20b4f]">
            <Link
              href="/"
              className={`transition hover:text-black no-underline ${pathname === "/" ? "text-black" : ""
                }`}
            >
              Home
            </Link>

            <Link
              href="/shop"
              className={`transition hover:text-black no-underline ${pathname === "/shop" ? "text-black" : ""
                }`}
            >
              Category
            </Link>

            <Link
              href="/blog-preview"
              className={`transition hover:text-black no-underline ${pathname === "/blog-preview" ? "text-black" : ""
                }`}
            >
              Blogs
            </Link>

            <Link
              href="/contact"
              className={`transition hover:text-black no-underline ${pathname === "/contact" ? "text-black" : ""
                }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#d20b4f] transition hover:bg-[#d20b4f] hover:text-black border-0 cursor-pointer shadow-xs"
              title="Search"
              type="button"
            >
              <i className="fas fa-search text-xs"></i>
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#d20b4f] transition hover:bg-[#d20b4f] hover:text-black no-underline shadow-xs"
              title="Cart"
            >
              <i className="fas fa-shopping-bag text-xs"></i>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d20b4f] text-[10px] font-bold text-black">
                3
              </span>
            </Link>

            {/* Auth / Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="rounded bg-[#d20b4f] px-3 py-1 text-xs font-bold text-black transition hover:bg-[#b80943] border-0 cursor-pointer flex items-center gap-1"
                >
                  <i className="fas fa-user-circle"></i>
                  <span className="max-w-[70px] truncate">{user?.name || "Account"}</span>
                  <i className="fas fa-chevron-down text-[9px]"></i>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-md bg-white p-2 shadow-lg border border-gray-100 z-50 text-xs">
                    <div className="border-b border-gray-100 px-2 py-1 text-gray-500 truncate">
                      {user?.email}
                    </div>
                    <Link
                      href="/cart"
                      className="block px-2 py-1.5 text-black hover:bg-[#fff0ad] no-underline rounded font-bold"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Cart
                    </Link>
                    <Link
                      href="/checkout"
                      className="block px-2 py-1.5 text-black hover:bg-[#fff0ad] no-underline rounded font-bold"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Checkout
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-2 py-1.5 text-[#d20b4f] hover:bg-[#fff0ad] no-underline rounded font-bold"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-red-600 hover:bg-red-50 rounded font-bold border-0 bg-transparent cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded bg-[#d20b4f] px-4 py-1 text-xs font-bold text-black transition hover:bg-[#b80943] no-underline"
              >
                Log In
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsNavOpen((prev) => !prev)}
              type="button"
              className="flex md:hidden h-8 w-8 items-center justify-center rounded bg-white text-[#d20b4f] border-0 cursor-pointer"
              aria-label="Toggle navigation"
            >
              <i className={`fas ${isNavOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isNavOpen && (
          <div className="border-t border-[#d20b4f]/20 bg-[#fff0ad] px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-bold text-[#d20b4f]">
              <Link
                href="/"
                className="transition hover:text-black no-underline"
                onClick={() => setIsNavOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="transition hover:text-black no-underline"
                onClick={() => setIsNavOpen(false)}
              >
                Category
              </Link>
              <Link
                href="/blog-preview"
                className="transition hover:text-black no-underline"
                onClick={() => setIsNavOpen(false)}
              >
                Blogs
              </Link>
              <Link
                href="/contact"
                className="transition hover:text-black no-underline"
                onClick={() => setIsNavOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-[#fff0ad]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading-font text-lg font-bold text-[#d20b4f]">
                Search Items
              </h3>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-black hover:text-[#d20b4f] border-0 bg-transparent text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSearchOpen(false);
                window.location.href = "/shop";
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Search Pagdi, Kundan, Poshak..."
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#d20b4f] focus:outline-hidden"
                autoFocus
              />
              <button
                type="submit"
                className="rounded bg-[#d20b4f] px-4 py-2 text-sm font-bold text-black hover:bg-[#b80943] transition border-0 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
