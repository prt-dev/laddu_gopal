export interface BlogItem {
  id?: number;
  client_id?: number;
  author_id?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  status?: number | string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  client_id?: number;
  author_id?: number;
  status?: number;
}
