import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuthQuery } from "@/features/auth/hooks";

interface AuthContextType {
  isAuthenticated: boolean;
  admin: { email: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  admin: null,
  login: () => false,
  logout: () => {},
});

const DEMO_ADMIN = { email: "admin@boatrider.com", password: "admin123" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: authData, isLoading } = useAuthQuery();
  const [admin, setAdmin] = useState<{ email: string } | null>(null);

  useEffect(() => {
    if (authData?.is_authenticated && authData?.user) {
      setAdmin(authData.user);
    } else if (!isLoading) {
      setAdmin(null);
    }
  }, [authData, isLoading]);

  const login = (email: string, password: string): boolean => {
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const user = { email };
      setAdmin(user);
      sessionStorage.setItem("cyclehub_auth", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    sessionStorage.removeItem("cyclehub_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!admin, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);