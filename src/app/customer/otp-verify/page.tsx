/* eslint-disable */

"use client";
export const dynamic = "force-dynamic"; // prevents SSR/static rendering

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/tools/axiosClient";
import { useUser } from "@/components/context/userContext";

export default function OTPVerificationPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get("email") || user?.email || "";
  const [email] = useState(initialEmail);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    setSuccess("");

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a complete 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const verify = await api.post("/auth/verify-otp", { token: otpString });
      if (verify?.data?.success) {
        setSuccess("OTP verified successfully!");
        toast.success("OTP verified successfully! Please login.");
        router.replace("/customer/login");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess("");
    inputRefs.current[0]?.focus();

    try {
      const response = await api.post("/auth/resend-otp", { email });
      if (response?.data?.success) {
        setSuccess("Code resent successfully!");
        toast.info("A new OTP has been sent to your email.");
        setCountdown(30);
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong while resending OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-orange-100 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  className="w-12 h-14 border-2 border-orange-200 rounded-xl text-center text-xl font-semibold focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                />
              ))}
            </div>

            {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg">{error}</div>}
            {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg">{success}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className={`font-semibold ${countdown > 0 ? "text-gray-400" : "text-orange-600 hover:text-orange-700"} transition-colors`}
              >
                Resend {countdown > 0 && `(${countdown}s)`}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
