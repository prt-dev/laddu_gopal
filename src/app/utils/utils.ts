import { BACKEND_URL } from "@/app/services/authService";

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

    // Prepend backend URL (e.g., http://127.0.0.1:8000/uploads/products/...)
    return `${BACKEND_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}
