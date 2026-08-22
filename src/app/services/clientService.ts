import { BASE_URL } from "@/app/services/authService";

export interface ClientItem {
  id?: number;
  name?: string;
  website_name?: string;
  website_url?: string;
  domain?: string;
  logo?: string;
  default_meta_title?: string;
  default_meta_description?: string;
  status?: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface GetClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
}

export async function getClients(
  { page = 1, limit = 10, search = "", status }: GetClientsParams = {},
  token: string
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (search?.trim()) {
    params.append("search", search.trim());
  }
  if (status !== undefined && status !== null) {
    params.append("status", status.toString());
  }

  const url = `${BASE_URL}/clients/all?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch clients"
    );
  }

  return response.json();
}

export async function getClientById(clientId: number, token: string) {
  const response = await fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch client"
    );
  }

  return response.json();
}

export async function createClientApi(data: Partial<ClientItem>, token: string) {
  const response = await fetch(`${BASE_URL}/clients/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to create client"
    );
  }

  return response.json();
}

export async function updateClientApi(
  clientId: number,
  data: Partial<ClientItem>,
  token: string
) {
  const response = await fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to update client"
    );
  }

  return response.json();
}

export async function deleteClientApi(clientId: number, token: string) {
  const response = await fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to delete client"
    );
  }

  return response.json();
}
