import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });
    setUser(res.data);
    navigate("/home");
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password }, { withCredentials: true });
    setUser(res.data);
    navigate("/home");
  };

  const logout = () => {
    axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate("/");
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};