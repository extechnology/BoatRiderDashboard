import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuthQuery } from "@/features/auth/hooks";
import { logoutUser } from "@/features/auth/api";
import { useQueryClient } from "@tanstack/react-query";

export interface AdminUser {
  email: string;
  name?: string;
  username?: string;
  id?: string | number;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  admin: null,
  login: () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: authData, isLoading } = useAuthQuery();
  const queryClient = useQueryClient();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (authData?.is_authenticated && authData?.user) {
      setAdmin(authData.user);
    } else if (authData?.is_authenticated && authData?.email) {
      setAdmin({ email: authData.email, ...authData });
    } else if (authData?.user) {
      setAdmin(authData.user);
    } else if (!isLoading) {
      // Check fallback session storage if previously saved
      const saved = sessionStorage.getItem("cyclehub_auth");
      if (saved) {
        try {
          setAdmin(JSON.parse(saved));
        } catch {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    }
  }, [authData, isLoading]);

  const login = (email: string, password: string): boolean => {
    const user = { email };
    setAdmin(user);
    sessionStorage.setItem("cyclehub_auth", JSON.stringify(user));
    return true;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Backend logout request failed:", err);
    } finally {
      setAdmin(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("cyclehub_auth");
      }
      await queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    }
  };

  const isAuthenticated = Boolean(
    admin ||
    (authData && (authData.is_authenticated || authData.user || authData.email))
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        admin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
