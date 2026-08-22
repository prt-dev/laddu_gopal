export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_BACKEND_URL ||
  "http://127.0.0.1:8000";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.NEXT_BACKEND_API_URL ||
  `${BACKEND_URL}/api/v1`;

export type Role = "admin" | "superadmin" | "user" | "manager" | "customer";

export interface User {
  id?: string | number;
  name?: string;
  email: string;
  username?: string | number;
  password?: string;
  role?: Role | string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  tenantId?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username?: string | number;
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterData {
  name?: string;
  email: string;
  password: string;
  username?: string | number;
  phone?: string;
  address?: string;
  role?: Role | string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type?: string;
  [key: string]: unknown;
}

/**
 * Send login request to the backend
 */
export async function loginApi(credentials: LoginCredentials): Promise<AuthTokenResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to log in"
    );
  }

  return response.json();
}

/**
 * Send register request to the backend
 */
export async function registerApi<T = unknown>(
  userData: RegisterData | Partial<User> | unknown
): Promise<T> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to register"
    );
  }

  return response.json();
}
