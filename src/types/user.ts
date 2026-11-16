export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  excludeRoles?: number[];
}

export interface UserSavePayload {
  id?: number | string;
  email?: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  phone?: string;
  username?: string;
  password?: string;
  role_id?: number;
  status?: number;
  additional_details?: { [key: string]: string | undefined | number };
  [key: string]: unknown;
}

export interface FetchedUserDetails {
  id?: number | string;
  name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
  additional_details?: any;
  [key: string]: unknown;
}
