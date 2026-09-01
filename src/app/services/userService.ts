import { BASE_URL } from "@/app/services/authService";



export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    excludeRoles?: number[];
}

export interface ClientItem {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    role?: string;
    amount?: string | number;
    avatar?: string;
    status?: string | number;
    statusBadge?: string;
    date?: string;
}

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

export interface UserSavePayload {
    id?: number | string;
    email?: string;
    firstname?: string;
    lastname?: string;
    name?: string;
    phone?: string;
    username?: string;
    password?: string;
    role_id?: number;
    status?: number;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    notes?: string;
    additional_details?: string;
    [key: string]: unknown;
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

