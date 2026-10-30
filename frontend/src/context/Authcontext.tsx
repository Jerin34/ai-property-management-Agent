import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { login as loginApi, getCurrentUser } from "../api/auth.api";
import type { AuthUser } from "../types/auth.types";
import { storage } from "../utils/storage";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedToken = storage.getToken();

      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (!isMounted) return;
        setUser(currentUser);
        setToken(storedToken);
      } catch {
        storage.removeToken();

        if (!isMounted) return;
        setUser(null);
        setToken(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await loginApi({ email, password });
      const { user: authenticatedUser, token: accessToken } = response.data;

      storage.setToken(accessToken);
      setToken(accessToken);
      setUser(authenticatedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.removeToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
