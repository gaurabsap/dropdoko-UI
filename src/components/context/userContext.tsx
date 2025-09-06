// "use client";

/* eslint-disable */

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";

type User = {
  id: string;
  name: string;
  email: string;
  profile?: string;
  role?: string;
};

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  googleLogin: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ----------------- LOGIN -----------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken } = res.data.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }

      const meRes = await api.get("/auth/me");
      const userData = meRes.data.user;

      if (userData.role === 'admin') {
        setIsAdmin(true);
        setUser(null);
        localStorage.removeItem("accessToken");
        toast.error("Admin accounts must use the admin portal");
        return false;
      }

      setUser(userData);
      setIsAdmin(false);
      toast.success(`Welcome ${userData.name || userData.email}!`);
      return true;

    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Invalid credentials";
      toast.error(errorMessage);
      return false; // Just return false, don't throw
    }
  };


  // ----------------- GOOGLE LOGIN -----------------
  const googleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1"}/auth/google`;
  };


  // ----------------- LOGOUT -----------------
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API error:", err);
      // Continue with client-side logout even if API call fails
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      setUser(null);
      setIsAdmin(false);
      toast.info("Logged out successfully");
    }
  };

  // ----------------- SIGNUP -----------------
  const signup = async (data: { name: string; email: string; password: string }): Promise<boolean> => {
    try {
      await api.post("/auth/signup", data);
      toast.success("Signup successful! Please login.");
      return true;
    } catch (err: any) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || "Signup failed";
      toast.error(errorMessage);
      return false;
    }
  };

  // ----------------- INIT AUTH ON RELOAD -----------------
  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token is still valid
        const res = await api.get("/auth/me");
        const userData = res.data.user;
        
        if (userData.role === 'admin') {
          setIsAdmin(true);
          setUser(null);
          localStorage.removeItem("accessToken");
          toast.info("Admin session ended. Please use admin portal.");
        } else {
          setUser(userData);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth init failed:", err);
        // Token is invalid, clear it
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, loading, isAdmin, logout, signup, googleLogin }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook for consuming the context
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}