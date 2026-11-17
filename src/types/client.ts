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
  title?: string;
  email?: string;
  phone?: string;
  role?: string;
  amount?: string | number;
  avatar?: string;
  statusBadge?: string;
  date?: string;
}

export interface GetClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
}
