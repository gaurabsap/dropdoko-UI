"use client";
/* eslint-disable */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/components/context/userContext";
import api from "@/tools/axiosClient";
import { useRouter } from "next/navigation";  // ⬅️ add this at top

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const router = useRouter();
  
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { login } = useUser();

  // Loading states
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // --- Signup handler ---
  const handleSignup = async () => {
    if (
      !signupData.fullName ||
      !signupData.email ||
      !signupData.phone ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      return; // Do nothing if empty
    }
    if (signupData.password !== signupData.confirmPassword) {
      return; // Do nothing if passwords don't match
    }

    try {
      setSignupLoading(true);
      await api.post("/auth/signup", signupData);
      setIsLogin(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSignupLoading(false);
    }
  };

  // --- Login handler ---
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) return;

    try {
      setLoginLoading(true);
      const success = await login(loginData.email, loginData.password);
      console.log(success)
      if (success) {
        router.push("/");
      }
      setLoginLoading(false);
    } catch (err: any) {
      console.error("Login failed:", err);
    } finally {
      setLoginLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative w-[850px] h-[550px] rounded-2xl shadow-lg bg-white overflow-hidden">
        {/* Basket (Doko) */}
        <motion.div
          animate={{ x: isLogin ? 0 : "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center p-6 z-10"
        >
          <motion.div
            animate={{ scale: isLogin ? 1 : 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className={`w-[680px] h-[580px] transition-transform duration-500 ${
                isLogin ? "rotate-[8deg]" : "rotate-[-20deg]"
              }`}
            >
              <Image
                src="/dokoo.png"
                alt="DropDoko Logo"
                width={600}
                height={600}
                className="object-contain w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          animate={{ x: isLogin ? 0 : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center p-6 z-20"
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="loginForm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-[80%]"
              >
                <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
                  Login
                </h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full border-b border-gray-300 mb-4 py-2 outline-none focus:border-orange-500 transition-colors"
                />
                <div className="relative mb-6">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full border-b border-gray-300 py-2 pr-10 outline-none focus:border-orange-500 transition-colors"
                  />
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 cursor-pointer"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </span>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={loginLoading}
                  className={`w-full py-3 rounded-full mt-2 flex items-center justify-center transition-colors ${
                    loginLoading
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {loginLoading ? (
                    <span className="animate-pulse">Logging in...</span>
                  ) : (
                    "Login"
                  )}
                </button>
                <button className="w-full border border-gray-300 py-2 rounded-full mt-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                  <Image
                    src="/google.png"
                    alt="Google Icon"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  Sign in with Google
                </button>
                <div className="flex justify-between text-sm mt-4">
                  <span
                    className="cursor-pointer text-orange-500 hover:text-orange-700 transition-colors"
                    onClick={() => setIsLogin(false)}
                  >
                    Create an account
                  </span>
                  <span className="cursor-pointer text-orange-500 hover:text-orange-700 transition-colors">
                    Forgot password
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signupForm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="w-[85%] pl-5 pr-[-10px]"
              >
                <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
                  Sign Up
                </h2>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  className="w-full border-b border-gray-300 mb-3 py-2 outline-none focus:border-orange-500 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="w-full border-b border-gray-300 mb-3 py-2 outline-none focus:border-orange-500 transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={signupData.phone}
                  onChange={(e) =>
                    setSignupData({ ...signupData, phone: e.target.value })
                  }
                  className="w-full border-b border-gray-300 mb-3 py-2 outline-none focus:border-orange-500 transition-colors"
                />
                <div className="relative mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="w-full border-b border-gray-300 py-2 pr-10 outline-none focus:border-orange-500 transition-colors"
                  />
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </span>
                </div>
                <div className="relative mb-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border-b border-gray-300 py-2 pr-10 outline-none focus:border-orange-500 transition-colors"
                  />
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 cursor-pointer"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </span>
                </div>
                <p className="text-xs mt-1 mb-3 text-gray-600">
                  By clicking sign up you agree to our{" "}
                  <span className="text-orange-500 cursor-pointer hover:underline">
                    terms and conditions
                  </span>
                  .
                </p>
                <button
                  onClick={handleSignup}
                  disabled={signupLoading}
                  className={`w-full py-3 rounded-full mt-2 flex items-center justify-center transition-colors ${
                    signupLoading
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {signupLoading ? (
                    <span className="animate-pulse">Signing up...</span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
                <button className="w-full border border-gray-300 py-2 rounded-full mt-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                  <Image
                    src="/google.png"
                    alt="Google Icon"
                    width={20}
                    height={20}
                    className="object-contain rotate-[-20deg]"
                  />
                  Sign up with Google
                </button>
                <div className="flex items-center justify-center text-sm mt-4 gap-1">
                  <span>Already registered?</span>
                  <span
                    className="cursor-pointer text-orange-500 hover:text-orange-700 transition-colors"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
