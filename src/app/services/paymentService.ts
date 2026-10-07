import { BASE_URL } from "@/app/services/authService";
import {
  PaymentItem,
  CreatePaymentPayload,
  RazorpayVerifyPayload,
  GetPaymentsParams,
  PaymentsResponse,
} from "@/app/types/payment";

export type {
  PaymentItem,
  CreatePaymentPayload,
  RazorpayVerifyPayload,
  GetPaymentsParams,
  PaymentsResponse,
};

/**
 * 1. Get All Payments
 * Matches Postman: GET {{host}}/api/v1/payments/all?page=1&limit=10&search=&status=&order_id=
 */
export async function getAllPayments(
  params: GetPaymentsParams = {},
  token: string
): Promise<PaymentsResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append("page", params.page.toString());
  if (params.limit !== undefined) query.append("limit", params.limit.toString());
  if (params.search?.trim()) query.append("search", params.search.trim());
  if (params.status?.trim()) query.append("status", params.status.trim());
  if (params.order_id !== undefined) query.append("order_id", params.order_id.toString());

  const url = `${BASE_URL}/payments/all${query.toString() ? `?${query.toString()}` : ""}`;

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
      errorData.detail || errorData.message || "Failed to fetch payments"
    );
  }

  return response.json();
}

/**
 * 2. Get Payment by ID
 * Matches Postman: GET {{host}}/api/v1/payments/{payment_id}
 */
export async function getPaymentById(
  paymentId: number | string,
  token: string
): Promise<PaymentItem> {
  const url = `${BASE_URL}/payments/${paymentId}`;

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
      errorData.detail || errorData.message || `Failed to fetch payment #${paymentId}`
    );
  }

  return response.json();
}

/**
 * 3. Get Payments by Order ID
 * Matches Postman: GET {{host}}/api/v1/payments/order/{order_id}
 */
export async function getPaymentsByOrderId(
  orderId: number | string,
  token: string
): Promise<PaymentItem[]> {
  const url = `${BASE_URL}/payments/order/${orderId}`;

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
      errorData.detail || errorData.message || `Failed to fetch payments for order #${orderId}`
    );
  }

  return response.json();
}

/**
 * 4. Create Payment Record
 * Matches Postman: POST {{host}}/api/v1/payments/create
 */
export async function createPaymentApi(
  payload: CreatePaymentPayload,
  token?: string | null
): Promise<PaymentItem> {
  const url = `${BASE_URL}/payments/create`;
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
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Failed to create payment record"
    );
  }

  return response.json();
}

/**
 * 5. Verify Razorpay Payment
 * Matches Postman: POST {{host}}/api/v1/payments/verify
 * Verifies Razorpay HMAC-SHA256 signature and updates order to 'paid'.
 */
export async function verifyRazorpayPaymentApi(
  payload: RazorpayVerifyPayload,
  token?: string | null
): Promise<PaymentItem> {
  const url = `${BASE_URL}/payments/verify`;
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
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || errorData.message || "Razorpay payment verification failed"
    );
  }

  return response.json();
}

/**
 * 6. Update Payment
 * Matches Postman: PUT {{host}}/api/v1/payments/{payment_id}
 */
export async function updatePaymentApi(
  paymentId: number | string,
  payload: Partial<CreatePaymentPayload> & { signature_verified?: boolean },
  token: string
): Promise<PaymentItem> {
  const url = `${BASE_URL}/payments/${paymentId}`;

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
      errorData.detail || errorData.message || `Failed to update payment #${paymentId}`
    );
  }

  return response.json();
}

/**
 * 7. Delete Payment
 * Matches Postman: DELETE {{host}}/api/v1/payments/{payment_id}
 */
export async function deletePaymentApi(
  paymentId: number | string,
  token: string
): Promise<{ message: string }> {
  const url = `${BASE_URL}/payments/${paymentId}`;

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
      errorData.detail || errorData.message || `Failed to delete payment #${paymentId}`
    );
  }

  return response.json();
}
