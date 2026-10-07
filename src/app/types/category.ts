export interface CategoryItem {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  parent_id?: number | null;
  status?: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  parent_id?: number;
  status?: number;
}

export interface GetCategoriesResponse {
  total: number;
  categories: CategoryItem[];
  items: CategoryItem[];
}
