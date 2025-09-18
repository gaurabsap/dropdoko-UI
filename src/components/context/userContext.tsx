/* eslint-disable */
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";



type User = {
  _id?: string;
  fullName?: string;
  phoneNumber?: string;
  id: string;
  name: string;
  email: string;
  profile?: string;
  role?: string;
  isVerified?: boolean;
};

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  signup: (data: { fullName: string; email: string; password: string }) => Promise<boolean>;
  googleLogin: () => void;
  isEmailVerified: boolean; 
  refreshUser: () => Promise<void>; 
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);


    const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      const userData = res.data.user;
      setUser(userData);
      setIsAdmin(userData?.role === "admin");
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
      setIsAdmin(false);
    }
  };

  // ----------------- LOGIN -----------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await api.post("/auth/login", { email, password });

      // Get current user info
      const meRes = await api.get("/auth/me");
      const userData = meRes.data.user;
      if (!userData) return false;

      // Check if user is verified
      // if (!userData.isVerified) {
      //   setUser(null);

      //   // Call OTP resend API
      //   try {
      //     await api.post("/auth/resend-otp", { email });
      //     router.push(`/customer/otp-verify?email=${encodeURIComponent(userData?.email)}`);
      //   } catch (otpErr: any) {
      //     console.error("OTP resend error:", otpErr);
      //     toast.error("Failed to resend OTP. Please try again later.");
      //   }

      //   toast.error("Please verify your email before logging in.");
      //   return false;
      // }

      // Check for admin
      // if (userData.role === "admin") {
      //   setIsAdmin(true);
      //   return false;
      // }

      // Success
      setUser(userData);
      setIsAdmin(false);
      toast.success(`Welcome ${userData.fullName || userData.email}!`);
      return true;

    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Invalid credentials";
      toast.error(errorMessage);
      return false;
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
    } finally {
      setUser(null);
      setIsAdmin(false);
      // toast.info("Logged out successfully");
      router.push("/");
    }
  };

  // ----------------- SIGNUP -----------------
  const signup = async (data: { fullName: string; email: string; password: string }): Promise<boolean> => {
    try {
      await api.post("/auth/signup", data);
      toast.success("Signup successful! Please enter the OTP sent to your email.");
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
      try {
        const res = await api.get("/auth/me");
        const userData = res.data.user;

        // if (userData.role === 'admin') {
        //   setIsAdmin(true);
        //   setUser(null);
        //   toast.info("Admin session ended. Please use admin portal.");
        // } else {

        // }
        setUser(userData);
        setIsAdmin(false);
      } catch (err) {
        console.error("Auth init failed:", err);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);
  const isEmailVerified = user?.isVerified ?? false;

  // ----------------- RENDER CONTEXT PROVIDER -----------------
  return (
    <UserContext.Provider value={{ user, login, loading, isAdmin, logout, signup, googleLogin, isEmailVerified, refreshUser }}>
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
