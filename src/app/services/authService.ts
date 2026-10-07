export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_BACKEND_URL ||
  "http://127.0.0.1:8000";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.NEXT_BACKEND_API_URL ||
  `${BACKEND_URL}/api/v1`;

import {
  Role,
  User,
  LoginCredentials,
  RegisterData,
  AuthTokenResponse,
} from "@/app/types/auth";

export {
  type Role,
  type User,
  type LoginCredentials,
  type RegisterData,
  type AuthTokenResponse,
};

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
