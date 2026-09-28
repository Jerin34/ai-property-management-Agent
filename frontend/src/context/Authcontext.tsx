import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { login as loginApi , getCurrentUser} from "../api/auth.api";
import type { AuthUser } from "../types/auth.types";
import { storage } from "../utils/storage";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [token, setToken] = useState<string | null>(
    storage.getToken()
  );

  const [isLoading, setIsLoading] = useState(false);
useEffect(() => {
  const restoreSession = async () =>{
    const token = storage.getToken();
    if(!token){
      setIsLoading(false);
      return ;
    }
    try{
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setToken(token);
    }catch{
      storage.removeToken();
      setUser(null);
      setToken(null);
    }finally{
      setIsLoading(false);
    }
  };
  restoreSession();
},[])

  const login = async (
    email: string,
    password: string
  ) => {
    console.log("Login error",email)
    setIsLoading(true);

    try {
      const response = await loginApi({
        email,
        password,
      });
      console.log("Login error",response)
      const { user, token } = response.data;

      storage.setToken(token);

      setToken(token);
      setUser(user);
    } 
    catch(error){
      console.log("Login error",error)
      throw error;
    }
    finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.removeToken();

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
