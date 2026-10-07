import { BACKEND_URL } from "@/app/services/authService";
import { initialEmptyForm } from "@/context/CheckoutContext";
import { BillingFormData } from "@/types";

export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Resolves relative image paths (e.g. "/uploads/products/xyz.png") to full backend URLs
 */
export function getFullImageUrl(url?: string | null): string {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";

    // If already absolute or blob/data preview
    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("blob:") ||
        trimmed.startsWith("data:")
    ) {
        return trimmed;
    }

    // If local static asset from public folder (e.g. /assets/..., /images/...)
    if (
        trimmed.startsWith("/assets/") ||
        trimmed.startsWith("/images/") ||
        trimmed.startsWith("assets/") ||
        trimmed.startsWith("images/") ||
        trimmed.startsWith("/favicon")
    ) {
        return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    }

    // Prepend backend URL (e.g., http://127.0.0.1:8000/uploads/products/...)
    return `${BACKEND_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

/**
 * Checks window scroll position and updates visibility state
 */
export function handleScroll(
    setShowBackToTop: (show: boolean) => void,
    threshold: number = 300
): void {
    if (typeof window === "undefined") return;
    if (window.scrollY > threshold) {
        setShowBackToTop(true);
    } else {
        setShowBackToTop(false);
    }
}

/**
 * Smoothly scrolls the window to the top
 */
export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
    if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior });
    }
}

export * from "./remoteUpload";


export function extractUserDetails(u: any): BillingFormData {
    if (!u) return initialEmptyForm;
    let additional: any = u.additional_details;
    if (typeof additional === "string") {
        try {
            additional = JSON.parse(additional);
        } catch { }
    }
    const addObj = additional && typeof additional === "object" ? additional : {};

    return {
        firstName: (u.firstname || (u.name ? u.name.split(" ")[0] : "") || "").trim(),
        lastName: (u.lastname || (u.name ? u.name.split(" ").slice(1).join(" ") : "") || "").trim(),
        address: (u.address || addObj.address || "").trim(),
        city: (u.city || addObj.city || "").trim(),
        state: (u.state || addObj.state || "").trim(),
        pincode: (u.pincode || addObj.pincode || "").trim(),
        phone: (u.phone || "").trim(),
        email: (u.email || "").trim(),
        notes: (u.notes || addObj.notes || "").trim(),
    };
}
