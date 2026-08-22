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
    User,
    Role,
    LoginCredentials,
} from "@/app/services/authService";
import { getUserProfileApi } from "@/app/services/userService";

export type { User, Role, LoginCredentials };

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: LoginCredentials) => Promise<void>;
    logout: () => void;
    getUser: (authToken: string) => Promise<User | null>;
    // updateUser: (partialData: Partial<User>) => void;
    hasRole: (roles: (Role | string) | (Role | string)[]) => boolean;
    hasPermission: (permission: string) => boolean;
}

const STORAGE_KEYS = {
    USER: "saas_auth_user",
    TOKEN: "saas_auth_token",
} as const;


const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
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
            console.error("Failed to load auth from localStorage:", error);
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
            console.error("Failed to get admin user profile:", error);
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
                router.push("/admin/dashboard");
            } catch (error) {
                console.error("Failed to login:", error);
            }
        },
        [getUser, router]
    );

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        router.push("/admin-login");
    }, [router]);

    const hasRole = useCallback(
        (roles: (Role | string) | (Role | string)[]) => {
            if (!user || !user.role) return false;
            const roleArray = Array.isArray(roles) ? roles : [roles];
            return roleArray.includes(user.role);
        },
        [user]
    );

    const hasPermission = useCallback(
        (permission: string) => {
            if (!user || !user.permissions) return false;
            return user.permissions.includes(permission);
        },
        [user]
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                getUser,
                hasRole,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be inside AuthProvider");
    }

    return context;
}