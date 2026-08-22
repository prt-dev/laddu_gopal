"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

import {
  loginApi,
  registerApi,
  User,
  LoginCredentials,
  RegisterData,
} from "@/app/services/authService";
import { getUserProfileApi } from "@/app/services/userService";

// Re-export / alias for backward compatibility
export type WebUser = User;
export type loginUser = LoginCredentials;

interface WebAuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: LoginCredentials) => void;
  register: (userData: RegisterData | User) => void;
  logout: () => void;
  updateProfile: (partialData: Partial<User>) => void;
}

const STORAGE_KEYS = {
  USER: "web_customer_user",
  TOKEN: "web_customer_token",
} as const;

const WebAuthContext = createContext<WebAuthContextType | undefined>(
  undefined
);

export function WebAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to load web customer auth from localStorage:", error);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.USER || e.key === STORAGE_KEYS.TOKEN) {
        if (!e.newValue) {
          setUser(null);
          setToken(null);
        } else if (e.key === STORAGE_KEYS.USER) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {
            setUser(null);
          }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getUser = useCallback(async (authToken: string) => {
    try {
      const data = await getUserProfileApi(authToken);
      setUser(data);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  }, []);

  const login = useCallback(
    async (userData: LoginCredentials) => {
      try {
        const data = await loginApi(userData);
        setToken(data.access_token);
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
        await getUser(data.access_token);
        router.push("/");
      } catch (error) {
        console.error("Failed to login:", error);
      }
    },
    [getUser, router]
  );

  const register = useCallback(
    async (userData: RegisterData | User) => {
      try {
        await registerApi(userData);
        await login({
          email: userData.email || '',
          password: userData.password || '',
        });
      } catch (error) {
        console.error("Failed to register:", error);
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, []);

  const updateProfile = useCallback((partialData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partialData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <WebAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </WebAuthContext.Provider>
  );
}

export function useWebAuth() {
  const context = useContext(WebAuthContext);

  if (!context) {
    throw new Error("useWebAuth must be inside WebAuthProvider");
  }

  return context;
}
