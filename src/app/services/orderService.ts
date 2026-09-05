import { BASE_URL } from "@/app/services/authService";

export interface OrderItem {
  id?: number;
  order_number?: string;
  user_id?: number;
  amount?: number;
  currency?: string;
  status?: "pending" | "paid" | "failed" | "cancelled" | string;
  razorpay_order_id?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
    [key: string]: unknown;
  };
  payments?: any[];
  [key: string]: unknown;
}

export interface CreateOrderPayload {
  amount: number;
  currency?: string;
  status?: string;
  phone?: string;
  email?: string;
  username?: string;
  user_id?: number;
  order_number?: string;
  razorpay_order_id?: string;
}

export interface UpdateOrderPayload {
  amount?: number;
  currency?: string;
  status?: string;
  order_number?: string;
  razorpay_order_id?: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  user_id?: number;
}

export interface OrdersResponse {
  total: number;
  orders: OrderItem[];
}

/**
 * 1. Get All Orders
 * Matches Postman: GET {{host}}/api/v1/orders/all?page=1&limit=10&search=&status=&user_id=
 */
export async function getAllOrders(
  params: GetOrdersParams = {},
  token: string
): Promise<OrdersResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.limit !== undefined) query.append("limit", params.limit.toString());
  if (params.search?.trim()) query.append("search", params.search.trim());
  if (params.status?.trim()) query.append("status", params.status.trim());
  if (params.user_id !== undefined) query.append("user_id", params.user_id.toString());

  const url = `${BASE_URL}/orders/all${query.toString() ? `?${query.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch orders"
    );
  }

  return response.json();
}

/**
 * 2. Get My Orders
 * Matches Postman: GET {{host}}/api/v1/orders/my-orders
 */
export async function getMyOrders(token: string): Promise<OrderItem[]> {
  const url = `${BASE_URL}/orders/my-orders`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to fetch user orders"
    );
  }

  return response.json();
}

/**
 * 3. Get Order by ID
 * Matches Postman: GET {{host}}/api/v1/orders/{order_id}
 */
export async function getOrderById(
  orderId: number | string,
  token?: string | null
): Promise<OrderItem> {
  const url = `${BASE_URL}/orders/${orderId}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || `Failed to fetch order #${orderId}`
    );
  }

  return response.json();
}

/**
 * 4. Get Order by Order Number
 * Matches Postman: GET {{host}}/api/v1/orders/number/{order_number}
 */
export async function getOrderByNumber(
  orderNumber: string,
  token?: string | null
): Promise<OrderItem> {
  const url = `${BASE_URL}/orders/number/${encodeURIComponent(orderNumber)}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || `Failed to fetch order ${orderNumber}`
    );
  }

  return response.json();
}

/**
 * 5. Create Order
 * Matches Postman: POST {{host}}/api/v1/orders/create
 * User ID can be determined from authenticated bearer token, or resolved automatically via phone, email, or username.
 */
export async function createOrderApi(
  payload: CreateOrderPayload,
  token?: string | null
): Promise<OrderItem> {
  const url = `${BASE_URL}/orders/create`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      amount: payload.amount,
      currency: payload.currency || "INR",
      status: payload.status || "pending",
      phone: payload.phone || undefined,
      email: payload.email || undefined,
      username: payload.username || undefined,
      user_id: payload.user_id || undefined,
      order_number: payload.order_number || undefined,
      razorpay_order_id: payload.razorpay_order_id || undefined,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to create order"
    );
  }

  return response.json();
}

/**
 * 6. Update Order
 * Matches Postman: PUT {{host}}/api/v1/orders/{order_id}
 */
export async function updateOrderApi(
  orderId: number | string,
  payload: UpdateOrderPayload,
  token: string
): Promise<OrderItem> {
  const url = `${BASE_URL}/orders/${orderId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || `Failed to update order #${orderId}`
    );
  }

  return response.json();
}

/**
 * 7. Delete Order
 * Matches Postman: DELETE {{host}}/api/v1/orders/{order_id}
 */
export async function deleteOrderApi(
  orderId: number | string,
  token: string
): Promise<{ message: string }> {
  const url = `${BASE_URL}/orders/${orderId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || `Failed to delete order #${orderId}`
    );
  }

  return response.json();
}
