import { BASE_URL, User } from "@/app/services/authService";
import {
    GetUsersParams,
    UserSavePayload,
    FetchedUserDetails,
} from "@/app/types/user";
import { ClientItem } from "@/app/types/client";

export type {
    GetUsersParams,
    ClientItem,
    UserSavePayload,
    FetchedUserDetails,
};

export async function getUsers({
    page = 1,
    limit = 10,
    search = '',
    excludeRoles = [],
}: GetUsersParams, token: string) {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (search?.trim()) {
        params.append("search", search.trim());
    }
    if (excludeRoles?.length) {
        params.append("exclude_roles", excludeRoles.join(","));
    }

    const url = `${BASE_URL}/users/all?${params.toString()}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.detail || errorData.message || "Failed to fetch users"
        );
    }

    return response.json();
}

/**
 * Fetch authenticated user profile using bearer access token
 */
export async function getUserProfileApi(token: string) {
    const response = await fetch(`${BASE_URL}/users/profile`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.detail || errorData.message || "Failed to fetch user profile"
        );
    }

    return response.json();
}

/**
 * Save / Upsert user profile & billing details
 * Endpoint: POST /api/v1/users/save
 * Matching postman.json "Save / Upsert User (Create or Update)"
 */
export async function saveUserApi(
    data: UserSavePayload,
    token?: string | null,
    userId?: number | string
) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const queryParams = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
    const url = `${BASE_URL}/users/save${queryParams}`;

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.detail || errorData.message || "Failed to save user details"
        );
    }

    return response.json();
}

export const DEVOTEE_BILLING_STORAGE_KEY = "devotee_billing_details";

export async function fetchUserDetailsByPhoneOrEmail(
    params: { phone?: string; email?: string },
    token?: string | null
): Promise<User | null> {
    const query = new URLSearchParams();
    if (params.phone?.trim()) query.append("phone", params.phone.trim());
    if (params.email?.trim()) query.append("email", params.email.trim());

    const headers: Record<string, string> = {
        "Accept": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (params.phone?.trim() || params.email?.trim()) {
        try {
            const url = `${BASE_URL}/users/details?${query.toString()}`;
            const response = await fetch(url, {
                method: "GET",
                headers,
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (err) {
            console.warn("Could not reach /users/details endpoint:", err);
        }
    }

    if (token) {
        try {
            const profile = await getUserProfileApi(token);
            if (profile) return profile;
        } catch (err) {
            console.warn("Could not fetch user profile fallback:", err);
        }
    }

    return null;
}


