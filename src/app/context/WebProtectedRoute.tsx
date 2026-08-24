"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWebAuth } from "@/app/context/WebAuthContext";
import Loading from "@/app/components/common/Loading";

interface Props {
  children: React.ReactNode;
}

export default function WebProtectedRoute({ children }: Props) {
  const { isLoading, isAuthenticated } = useWebAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicWebPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/shop" ||
    pathname === "/shop-detail" ||
    pathname === "/blog-preview" ||
    pathname === "/contact" ||
    // pathname === "/cart" ||
    // pathname === "/checkout" ||
    pathname === "/testimonial" ||
    pathname?.startsWith("/shop") ||
    pathname?.startsWith("/blog");

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicWebPage) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }

    if (!isLoading && isAuthenticated && isAuthPage) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isPublicWebPage, isAuthPage, pathname, router]);

  if (isLoading) {
    return <Loading variant="web" message="Loading..." />;
  }

  if (!isAuthenticated && !isPublicWebPage) {
    return <Loading variant="web" message="Redirecting..." />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Loading variant="web" message="Redirecting..." />;
  }

  return <>{children}</>;
}

