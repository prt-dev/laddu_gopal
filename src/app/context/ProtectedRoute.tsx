"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Loading from "@/app/components/common/Loading";

interface Props {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isAuthPage =
        pathname === "/" ||
        pathname === "/admin" ||
        // pathname === "/register" ||
        pathname === "/forgot-password" ||
        pathname === "/admin-login" ||
        pathname === "/admin-create-account" ||
        pathname === "/admin-forgot-password";

    const isAuthenticatedPage = [
        "/admin/settings",
        "/admin/dashboard",
        "/admin/users",
        "/admin/products",
        "/admin/product/add",
        "/admin/product/edit",
        "/admin/clients",
        "/admin/client/add",
        "/admin/client/edit",
        "/admin/blogs",
        "/admin/blog/add",
        "/admin/blog/edit",
        "/admin/blog/preview",
    ];

    const isAdminRole =
        user?.role === "admin" ||
        user?.role === "superadmin" ||
        user?.role === "manager";


    const isAuthRoute = isAuthenticatedPage.some(
        (page) => pathname === page || pathname.startsWith(page + "/")
    );

    useEffect(() => {
        if (!isLoading && !isAuthenticated && isAuthRoute) {
            router.push(`/admin-login?redirect=${encodeURIComponent(pathname)}`);
        }

        if (!isLoading && isAuthenticated && isAuthPage) {
            router.replace("/admin/dashboard");
        }
    }, [isLoading, isAuthenticated, isAuthPage, isAuthRoute, pathname, router]);

    if (isLoading) {
        return <Loading variant="admin" message="Loading Admin Portal..." />;
    }

    if (!isAuthenticated && !isAuthPage) {
        return <Loading variant="admin" message="Loading Admin Portal..." />;
    }

    if (isAuthenticated && !isAuthRoute) {
        return <Loading variant="admin" message="Loading Admin Portal..." />;
    }

    return <>{children}</>;
}