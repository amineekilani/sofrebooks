import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

interface AuthContextType {
  user: { userId: string; token: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ userId: string; token: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setUser({ userId, token });
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/users/login", { email, password });
    const { token, userId } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser({ userId, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};