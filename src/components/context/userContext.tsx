"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import api from "@/libs/axiosClient";
import { toast } from "react-toastify";

type User = {
  id: string;
  name: string;
  email: string;
  profile?: string;
};

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loading: boolean;
  logout: () => void;
  signup?: (data: { name: string; email: string; password: string }) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ----------------- LOGIN -----------------
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { accessToken } = res.data.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }

      // Fetch user info immediately after login
      const meRes = await api.get("/auth/me");
      setUser(meRes.data.user);

      toast.success(`Welcome ${meRes.data.user.email}!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  // ----------------- LOGOUT -----------------
  const logout = async () => {
    const res = await api.post("/auth/logout")
    if (res.status !== 200) {
      toast.error("Logout failed");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    setUser(null);
    toast.info("Logged out");
  };

  // ----------------- SIGNUP (OPTIONAL) -----------------
  const signup = async (data: { name: string; email: string; password: string }) => {
    try {
      const res = await api.post("/auth/signup", data);
      toast.success("Signup successful 🎉 Please login.");
      console.log("Signed up:", res.data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  // ----------------- INIT AUTH ON RELOAD -----------------
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") return;

      try {
        const refreshRes = await api.post("/auth/refresh", {}, { withCredentials: true });
        const { accessToken } = refreshRes.data;
        localStorage.setItem("accessToken", accessToken);

        // Now fetch current user
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Auth init failed:", err);
        setUser(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

//   if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, login, loading, logout, signup }}>
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
