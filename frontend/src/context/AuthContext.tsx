import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User
{
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType
{
    user: User | null;
    login: (email: string, password: string)=>Promise<void>;
    register: (name: string, email: string, password: string)=>Promise<void>;
    logout: ()=>Promise<void>;
    isLoading: boolean;
}

export const AuthContext=createContext<AuthContextType | undefined>(undefined);
const api=axios.create({baseURL: "http://localhost:5000/api", withCredentials: true});

api.interceptors.response.use((response)=>response, async(error)=>
{
    const originalRequest=error.config;
    if (error.response?.status===401 && error.response?.data?.isExpired && !originalRequest._retry)
    {
        originalRequest._retry=true;
        try
        {
            await api.post("/auth/refresh");
            return api(originalRequest);
        }
        catch (refreshError)
        {
            window.location.href="/login";
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export const AuthProvider=({ children }:{ children: React.ReactNode })=>
{
    const [user, setUser]=useState<User | null>(null);
    const [isLoading, setIsLoading]=useState(true);
    const navigate=useNavigate();
    const checkAuth = useCallback(async()=>
    {
        try
        {
            const res=await api.get("/auth/me");
            setUser(res.data);
        }
        catch (error)
        {
            setUser(null);
        }
        finally
        {
            setIsLoading(false);
        }
    }, []);
    useEffect(()=>{checkAuth();}, [checkAuth]);
    const login=async(email: string, password: string)=>
    {
        const res = await api.post("/auth/login", { email, password });
        setUser(res.data);
        navigate("/home");
    };
    const register=async(name: string, email: string, password: string)=>
    {
        const res=await api.post("/auth/register", { name, email, password });
        setUser(res.data);
        navigate("/home");
    };
    const logout=async()=>
    {
        await api.post("/auth/logout");
        setUser(null);
        navigate("/login");
    };
    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};