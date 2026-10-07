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
  cart_id?: number;
  products?: string | any;
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
