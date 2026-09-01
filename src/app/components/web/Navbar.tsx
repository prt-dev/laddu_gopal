"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "../../config/site";
import { useWebAuth } from "@/app/context/WebAuthContext";
import { useCart } from "@/app/context/CartContext";
import { getProducts, ProductItem } from "@/app/services/productService";
import { getCategories, CategoryItem } from "@/app/services/categoryService";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useWebAuth();
  const { cartCount } = useCart();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadNavData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts({ limit: 50 }),
          getCategories({ limit: 20 }),
        ]);
        if (isMounted) {
          setProductsList(prodRes.products || []);
          setCategoriesList(catRes.categories || []);
        }
      } catch (err) {
        console.error("Navbar data fetch error:", err);
      }
    }
    loadNavData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setIsNavOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Handle ESC key to close search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
    setIsSearchOpen(false);
  };

  const handleCategoryQuickSearch = (cat: string) => {
    router.push(`/shop?category=${encodeURIComponent(cat)}`);
    setIsSearchOpen(false);
  };

  // Instant live search results as devotee types
  const liveResults = searchQuery.trim()
    ? productsList
      .filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.desc || p.description || "").toLowerCase().includes(q)
        );
      })
      .slice(0, 4)
    : [];

  const quickCategories =
    categoriesList.length > 0
      ? categoriesList.map((c) => c.name || "").filter(Boolean)
      : ["Poshak", "Pagdi", "Kundan Shringar", "Special"];

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
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(true);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#d20b4f] transition hover:bg-[#d20b4f] hover:text-white border-0 cursor-pointer shadow-xs"
              title="Search Sacred Items"
              type="button"
            >
              <i className="fas fa-search text-xs"></i>
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#d20b4f] transition hover:bg-[#d20b4f] hover:text-white no-underline shadow-xs"
              title="Cart"
            >
              <i className="fas fa-shopping-bag text-xs"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d20b4f] text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth / Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="rounded bg-[#d20b4f] px-3 py-1 text-xs font-bold text-white transition hover:bg-[#b80943] border-0 cursor-pointer flex items-center gap-1 shadow-xs"
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
                className="hidden rounded bg-[#d20b4f] px-4 py-1 text-xs font-bold text-white transition hover:bg-[#b80943] no-underline shadow-xs"
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
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-16 sm:pt-24"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-5 sm:p-6 shadow-2xl border border-[#fff0ad] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 border-b border-[#fff0ad] pb-2">
              <h3 className="heading-font text-lg font-bold text-[#d20b4f] flex items-center gap-2 mb-0">
                <i className="fas fa-search text-sm"></i>
                <span>Search Sacred Items</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="h-7 w-7 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 flex items-center justify-center border-0 bg-transparent text-lg font-bold cursor-pointer transition"
                title="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Poshak, Pagdi, Kundan, Mukut..."
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-black focus:border-[#d20b4f] focus:outline-hidden pr-8 shadow-2xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black border-0 bg-transparent cursor-pointer text-xs"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="rounded-lg bg-[#d20b4f] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#b80943] transition border-0 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Quick Category Tags */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-gray-500 block mb-1.5">
                Popular Categories:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryQuickSearch(cat)}
                    className="rounded-full bg-[#fff0ad]/70 hover:bg-[#d20b4f] hover:text-white text-gray-800 text-xs font-bold px-3 py-1 border border-[#fff0ad] transition cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Instant Search Suggestions */}
            {searchQuery.trim() && (
              <div className="border-t border-[#fff0ad] pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">
                    Quick Results ({liveResults.length}):
                  </span>
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-[#d20b4f] hover:underline bg-transparent border-0 cursor-pointer p-0"
                  >
                    View all in Shop &rarr;
                  </button>
                </div>

                {liveResults.length > 0 ? (
                  <div className="space-y-2">
                    {liveResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop-detail?id=${product.id}&size=Size%202`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-lg border border-[#fff0ad] hover:bg-[#fff0ad]/30 transition no-underline text-black group"
                      >
                        <div className="h-10 w-10 flex-shrink-0 bg-[#fff0ad] p-1 flex items-center justify-center rounded overflow-hidden">
                          <img
                            src={product.img}
                            alt={product.name}
                            className="h-full w-full object-contain group-hover:scale-105 transition"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate group-hover:text-[#d20b4f]">
                              {product.name}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#d20b4f] text-white">
                              {product.category}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#d20b4f]">
                            {product.price}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-gray-500">
                    No matching items found. Press search to browse all items in shop.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
