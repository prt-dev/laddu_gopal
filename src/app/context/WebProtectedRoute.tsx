"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWebAuth } from "@/app/context/WebAuthContext";
import Loading from "@/app/components/common/Loading";

import { PUBLIC_ROUTE_PATHS, AUTH_ROUTE_PATHS } from "@/app/config/links";

interface Props {
  children: React.ReactNode;
}

export default function WebProtectedRoute({ children }: Props) {
  const { isLoading, isAuthenticated } = useWebAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicWebPage =
    PUBLIC_ROUTE_PATHS.includes(pathname) ||
    pathname?.startsWith("/shop") ||
    pathname?.startsWith("/blog");

  const isAuthPage = AUTH_ROUTE_PATHS.includes(pathname);

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

