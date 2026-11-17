export type Role = "admin" | "superadmin" | "user" | "manager" | "customer";

export interface User {
  id?: string | number;
  name?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  username?: string | number;
  password?: string;
  role?: Role | string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  tenantId?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  username?: string | number;
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterData {
  name?: string;
  email: string;
  password: string;
  username?: string | number;
  phone?: string;
  address?: string;
  role?: Role | string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type?: string;
  [key: string]: unknown;
}

export type WebUser = User;
export type loginUser = LoginCredentials;

export interface WebAuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData | User) => Promise<void>;
  logout: () => void;
  updateProfile: (partialData: Partial<User>) => void;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: LoginCredentials) => Promise<void>;
  logout: () => void;
  getUser: (authToken: string) => Promise<User | null>;
  hasRole: (roles: (Role | string) | (Role | string)[]) => boolean;
  hasPermission: (permission: string) => boolean;
}
