/* eslint-disable */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/tools/axiosClient";
import { Eye, EyeOff } from "lucide-react"; // 👁️ import icons

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or expired reset link.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", { token, newPassword: password });
      setSuccess("Password successfully updated. Redirecting to login...");
      setTimeout(() => router.push("/customer/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Reset failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative w-[850px] max-w-full h-[620px] rounded-2xl shadow-lg bg-white overflow-hidden">
        {/* Left side illustration */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full hidden lg:flex items-center justify-center p-6"
        >
          <motion.div animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="w-[600px] h-[580px] rotate-[8deg]">
              <Image
                src="/dokoo.png"
                alt="DropDoko Illustration"
                width={600}
                height={600}
                className="object-contain w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Right side form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative lg:absolute top-0 right-0 w-full lg:w-1/2 h-full flex items-center justify-center p-6 z-20"
        >
          <div className="w-[80%]">
            <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm text-center mb-6">
              Enter your new password below to secure your account.
            </p>

            {/* Password field with eye */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-2 pr-10 outline-none focus:border-orange-500 transition-colors"
              />
              <span
                className="absolute right-0 top-2 cursor-pointer text-gray-500 hover:text-orange-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* Confirm password field with eye */}
            <div className="relative mb-3">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-2 pr-10 outline-none focus:border-orange-500 transition-colors"
              />
              <span
                className="absolute right-0 top-2 cursor-pointer text-gray-500 hover:text-orange-500 transition-colors"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* Error / success messages */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-500 mb-3"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-green-600 mb-3"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              onClick={handleReset}
              disabled={loading}
              className={`w-full py-3 rounded-full mt-2 flex items-center justify-center transition-colors ${
                loading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {loading ? (
                <span className="animate-pulse">Updating...</span>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="flex justify-center mt-6 text-sm">
              <span
                className="cursor-pointer text-orange-500 hover:text-orange-700 transition-colors"
                onClick={() => router.push("/customer/login")}
              >
                ← Back to Login
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
