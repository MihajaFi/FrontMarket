import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authService, type User } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("mc_token");
    const savedUser = localStorage.getItem("mc_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("mc_token");
        localStorage.removeItem("mc_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem("mc_token", result.token);
    localStorage.setItem("mc_user", JSON.stringify(result.user));
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password);
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem("mc_token", result.token);
    localStorage.setItem("mc_user", JSON.stringify(result.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("mc_token");
    localStorage.removeItem("mc_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
