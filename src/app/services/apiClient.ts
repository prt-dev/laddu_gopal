import { BASE_URL, BACKEND_URL } from "@/app/services/authService";
import { HttpMethod, ApiOptions } from "@/app/types/api";

export { BASE_URL, BACKEND_URL, type HttpMethod, type ApiOptions };

/**
 * Get active auth token from localStorage in client-side runtime
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      localStorage.getItem("admin_token") ||
      localStorage.getItem("web_customer_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      null
    );
  } catch {
    return null;
  }
}

/**
 * Generate standard API request headers with Content-Type and optional Bearer token
 */
export function getApiHeaders(
  token?: string | null,
  contentType: string = "application/json"
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  const activeToken = token !== undefined ? token : getAuthToken();
  if (activeToken) {
    headers["Authorization"] = `Bearer ${activeToken}`;
  }
  return headers;
}

/**
 * Standard API response parser and error handler
 */
export async function handleApiResponse<T = any>(
  response: Response,
  defaultErrorMsg = "Request failed"
): Promise<T> {
  let responseData: any = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    responseData = await response.json().catch(() => ({}));
  } else {
    const text = await response.text().catch(() => "");
    try {
      responseData = text ? JSON.parse(text) : text;
    } catch {
      responseData = text;
    }
  }

  if (!response.ok) {
    const errorMessage =
      (responseData &&
        typeof responseData === "object" &&
        (responseData.detail || responseData.message || responseData.error)) ||
      `${defaultErrorMsg} (Status: ${response.status})`;

    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData as T;
}

/**
 * Build URL with query params
 */
export function buildFullUrl(
  endpoint: string,
  params?: Record<string, any>,
  baseURL: string = BASE_URL
): string {
  let url =
    endpoint.startsWith("http://") || endpoint.startsWith("https://")
      ? endpoint
      : `${baseURL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  return url;
}

/**
 * Dynamic API Calling Function
 *
 * @param method - HTTP Method ("GET" | "POST" | "PUT" | "PATCH" | "DELETE")
 * @param endpoint - API endpoint (e.g. "/products", "/auth/login")
 * @param data - Request payload (Body data for POST/PUT/PATCH, or Query params for GET/DELETE)
 * @param options - Additional options (token, custom headers, baseURL, signal, etc.)
 */
export async function apiClient<T = any>(
  method: HttpMethod = "GET",
  endpoint: string,
  data?: any,
  options: ApiOptions = {}
): Promise<T> {
  const upperMethod = method.toUpperCase() as "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  const isGetOrDelete = upperMethod === "GET" || upperMethod === "DELETE";

  // If GET/DELETE, treat plain object data as query params if options.params not set
  const queryParams =
    options.params || (isGetOrDelete && data && typeof data === "object" ? data : undefined);
  const fullUrl = buildFullUrl(endpoint, queryParams, options.baseURL || BASE_URL);

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  // Attach Bearer token if available
  const token = options.token !== undefined ? options.token : getAuthToken();
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body: BodyInit | undefined = undefined;

  // Prepare body for POST, PUT, PATCH (or if data provided for other methods)
  if (!isGetOrDelete && data !== undefined && data !== null) {
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      // Let browser set Content-Type with boundary for multipart/form-data
      delete headers["Content-Type"];
      body = data;
    } else if (typeof data === "string") {
      if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
      body = data;
    } else {
      if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }
  }

  const response = await fetch(fullUrl, {
    method: upperMethod,
    headers,
    body,
    cache: options.cache,
    next: options.next,
    signal: options.signal,
  });

  return handleApiResponse<T>(response, `Request failed with status ${response.status}`);
}

// Shorthand convenience methods
apiClient.get = <T = any>(endpoint: string, params?: Record<string, any>, options?: ApiOptions) =>
  apiClient<T>("GET", endpoint, params, options);

apiClient.post = <T = any>(endpoint: string, data?: any, options?: ApiOptions) =>
  apiClient<T>("POST", endpoint, data, options);

apiClient.put = <T = any>(endpoint: string, data?: any, options?: ApiOptions) =>
  apiClient<T>("PUT", endpoint, data, options);

apiClient.patch = <T = any>(endpoint: string, data?: any, options?: ApiOptions) =>
  apiClient<T>("PATCH", endpoint, data, options);

apiClient.delete = <T = any>(endpoint: string, data?: any, options?: ApiOptions) =>
  apiClient<T>("DELETE", endpoint, data, options);

export default apiClient;
