/* eslint-disable */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/components/context/userContext";
import api from "@/tools/axiosClient";
import { useRouter } from "next/navigation";

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

  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const { login, googleLogin, signup } = useUser();
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // --- Track screen width for responsive x animation ---
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Real-time validation ---
  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full name is required.";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = "Email is required.";
        else if (!emailRegex.test(value)) error = "Invalid email address.";
        break;
      case "phone":
        const phoneRegex = /^\d{10,15}$/;
        if (!value.trim()) error = "Phone number is required.";
        else if (!phoneRegex.test(value)) error = "Invalid phone number.";
        break;
      case "password":
        if (!value) error = "Password is required.";
        else if (value.length < 6) error = "Password must be at least 6 characters.";
        if (signupData.confirmPassword && value !== signupData.confirmPassword) {
          setSignupErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match." }));
        } else {
          setSignupErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password.";
        else if (value !== signupData.password) error = "Passwords do not match.";
        break;
    }
    setSignupErrors(prev => ({ ...prev, [name]: error }));
  };

  // --- Google Login ---
  const handleGoogleLogin = () => googleLogin();

  // --- Signup ---
  const handleSignup = async () => {
    const errors: Record<string, string> = {};
    Object.entries(signupData).forEach(([key, value]) => {
      switch (key) {
        case "fullName":
          if (!value.trim()) errors.fullName = "Full name is required.";
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value.trim()) errors.email = "Email is required.";
          else if (!emailRegex.test(value)) errors.email = "Invalid email address.";
          break;
        case "phone":
          const phoneRegex = /^\d{10,15}$/;
          if (!value.trim()) errors.phone = "Phone number is required.";
          else if (!phoneRegex.test(value)) errors.phone = "Invalid phone number.";
          break;
        case "password":
          if (!value) errors.password = "Password is required.";
          else if (value.length < 8) errors.password = "Password must be at least 6 characters.";
          if (signupData.confirmPassword && value !== signupData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
          }
          break;
        case "confirmPassword":
          if (!value) errors.confirmPassword = "Please confirm your password.";
          else if (value !== signupData.password) errors.confirmPassword = "Passwords do not match.";
          break;
      }
    });
    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSignupLoading(true);
      const { confirmPassword, ...payload } = signupData;
      await signup(payload);
      router.push("/customer/otp-verify?email=" + encodeURIComponent(payload.email));
    } finally {
      setSignupLoading(false);
    }
  };

  // --- Login ---
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) return;
    try {
      setLoginLoading(true);
      const success = await login(loginData.email, loginData.password);
      if (success) router.push("/");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative w-[850px] max-w-full h-[620px] rounded-2xl shadow-lg bg-white overflow-hidden">

        {/* Basket Image */}
        <motion.div
          animate={{ x: isLogin ? 0 : "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center p-6 z-10 hidden md:flex"
        >
          <motion.div animate={{ scale: isLogin ? 1 : 0.95 }} transition={{ duration: 0.4 }}>
            <div className={`w-[680px] h-[580px] transition-transform duration-500 ${isLogin ? "rotate-[8deg]" : "rotate-[-20deg]"}`}>
              <Image src="/dokoo.png" alt="DropDoko Logo" width={600} height={600} className="object-contain w-full h-full" />
            </div>
          </motion.div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          animate={{ x: isLogin ? 0 : isLargeScreen ? "-100%" : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative lg:absolute top-0 right-0 w-full lg:w-1/2 h-full flex items-center justify-center p-6 z-20"
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
                <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">Login</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full border-b border-gray-300 mb-4 py-2 outline-none focus:border-orange-500 transition-colors"
                />
                <div className="relative mb-6">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full border-b border-gray-300 py-2 pr-10 outline-none focus:border-orange-500 transition-colors"
                  />
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 cursor-pointer"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                  </span>
                </div>
                <button
                  onClick={handleLogin}
                  disabled={loginLoading}
                  className={`w-full py-3 rounded-full mt-2 flex items-center justify-center transition-colors ${
                    loginLoading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {loginLoading ? <span className="animate-pulse">Logging in...</span> : "Login"}
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full border border-gray-300 py-2 rounded-full mt-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <Image src="/google.png" alt="Google Icon" width={20} height={20} className="object-contain" />
                  Sign in with Google
                </button>
                <div className="flex justify-between text-sm mt-4">
                  <span className="cursor-pointer text-orange-500 hover:text-orange-700 transition-colors" onClick={() => setIsLogin(false)}>
                    Create an account
                  </span>
                  <span className="cursor-pointer text-orange-500 hover:text-orange-700 transition-colors">Forgot password</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signupForm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="w-full lg:w-auto pl-5 pr-[-10px] overflow-visible min-h-[480px]"
              >
                <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">Sign Up</h2>

                {["fullName", "email", "phone", "password", "confirmPassword"].map((field) => (
                  <div className="mb-3 relative min-h-[3.5rem]" key={field}>
                    <input
                      type={field.includes("password") ? (field === "password" ? (showPassword ? "text" : "password") : showConfirmPassword ? "text" : "password") : field === "email" ? "email" : "text"}
                      placeholder={field === "fullName" ? "Full Name" : field === "confirmPassword" ? "Confirm password" : field.charAt(0).toUpperCase() + field.slice(1)}
                      value={signupData[field as keyof typeof signupData]}
                      onChange={(e) => {
                        setSignupData({ ...signupData, [field]: e.target.value });
                        validateField(field, e.target.value);
                      }}
                      className="w-full border-b border-gray-300 py-2 pr-10 outline-none focus:border-orange-500 transition-colors"
                    />
                    {(field === "password" || field === "confirmPassword") && (
                      <span
                        className="absolute right-0 top-1/2 -translate-y-[80%] pr-2 cursor-pointer"
                        onClick={() =>
                          field === "password"
                            ? setShowPassword(!showPassword)
                            : setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {field === "password" ? (
                          showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-500" />
                          )
                        ) : showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-500" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-500" />
                        )}
                      </span>
                    )}

                    <AnimatePresence>
                      {signupErrors[field as keyof typeof signupErrors] && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-red-500 mt-1 absolute"
                        >
                          {signupErrors[field as keyof typeof signupErrors]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <p className="text-xs mt-1 mb-3 text-gray-600">
                  By clicking sign up you agree to our{" "}
                  <span className="text-orange-500 cursor-pointer hover:underline">terms and conditions</span>.
                </p>

                <button
                  onClick={handleSignup}
                  disabled={signupLoading}
                  className={`w-full py-3 rounded-full mt-2 flex items-center justify-center transition-colors cursor-pointer ${
                    signupLoading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {signupLoading ? <span className="animate-pulse">Signing up...</span> : "Sign Up"}
                </button>

                <button
                  onClick={handleGoogleLogin}
                  className="cursor-pointer w-full border border-gray-300 py-2 rounded-full mt-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <Image src="/google.png" alt="Google Icon" width={20} height={20} className="object-contain rotate-[-20deg]" />
                  Sign up with Google
                </button>

                <div className="flex items-center justify-center text-sm mt-4 gap-1">
                  <span>Already registered?</span>
                  <span className="cursor-pointer text-orange-500 hover:text-orange-700 transition-colors" onClick={() => setIsLogin(true)}>
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
