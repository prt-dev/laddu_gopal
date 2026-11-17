export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete";

export interface ApiOptions {
  token?: string | null;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  baseURL?: string;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  signal?: AbortSignal;
}
