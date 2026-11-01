
import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import axios from "axios";

import {
  login as loginApi,
  getCurrentUser,
} from "../api/auth.api";

import type { AuthUser } from "../types/auth.types";
import { storage } from "../utils/storage";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Restore or retry the existing session
  const restoreSession = useCallback(async (): Promise<void> => {
    const storedToken = storage.getToken();

    if (!storedToken) {
      setUser(null);
      setToken(null);
      setSessionError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSessionError(null);

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setToken(storedToken);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        storage.removeToken();
        setUser(null);
        setToken(null);
        setSessionError(null);
      } else {
        setSessionError(
          "Unable to verify your session. Please retry."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize authentication when the application mounts
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = storage.getToken();

      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
          setToken(storedToken);
          setSessionError(null);
        }
      } catch (error) {
        if (!isMounted) return;

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          storage.removeToken();
          setUser(null);
          setToken(null);
          setSessionError(null);
        } else {
          setSessionError(
            "Unable to verify your session. Please retry."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login
  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);
    setSessionError(null);

    try {
      const response = await loginApi({ email, password });
      const {
        user: loggedInUser,
        token: jwtToken,
      } = response.data;

      storage.setToken(jwtToken);
      setToken(jwtToken);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Explicit logout
  const logout = (): void => {
    storage.removeToken();
    setUser(null);
    setToken(null);
    setSessionError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        sessionError,
        login,
        logout,
        retrySession: restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
