import { CategoryItem } from "./category";

export interface ProductItem {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock_quantity?: number;
  category_id?: number;
  image_url?: string;
  status?: number | string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  category_obj?: CategoryItem;

  // Frontend helper properties
  img?: string;
  desc?: string;
  oldPrice?: string;
  sizes?: string[];
  specs?: { label: string; value: string }[];
  variant?: string | Record<string, number>;
  variant_prices?: Record<string, number>;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: number;
}

export interface GetProductsResponse {
  total: number;
  products: ProductItem[];
  items: ProductItem[];
}
