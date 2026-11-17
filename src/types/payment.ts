export interface PaymentItem {
  id?: number;
  order_id?: number;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  amount?: number;
  currency?: string;
  status?: "pending" | "captured" | "failed" | string;
  signature_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreatePaymentPayload {
  order_id: number;
  amount?: number;
  currency?: string;
  status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

export interface RazorpayVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id?: number;
}

export interface GetPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  order_id?: number;
}

export interface PaymentsResponse {
  total: number;
  payments: PaymentItem[];
}
