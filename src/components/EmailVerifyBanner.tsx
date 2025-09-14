/* eslint-disable */


"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/components/context/userContext";
import { useRouter } from "next/navigation";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";

export default function EmailVerifyBanner() {
  const { user, isEmailVerified } = useUser();
  const router = useRouter();
  const [visible, setVisible] = useState(false); // default false until we check localStorage
  const [loading, setLoading] = useState(false);

  // check localStorage on mount
  useEffect(() => {
    if (!user || isEmailVerified) return;
    const dismissed = localStorage.getItem("emailBannerDismissed");
    if (!dismissed) setVisible(true);
  }, [user, isEmailVerified]);

  if (!user || isEmailVerified || !visible) return null;

  const handleVerifyNow = async () => {
    if (!user?.email) return;
    setLoading(true);

    try {
      const res = await api.post("/auth/resend-otp", { email: user.email });

      if (res?.data?.success) {
        toast.success("OTP sent to your email!");
        router.push(`/customer/otp-verify?email=${encodeURIComponent(user.email)}`);
      } else {
        toast.error("Failed to send OTP. Try again.");
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      toast.error(err.response?.data?.error || "Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("emailBannerDismissed", "true");
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-3.5 flex items-center justify-between shadow-lg animate-fade-in-down">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium">Verify your email address</p>
          <p className="text-xs opacity-90">Confirm your email to unlock all features</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handleVerifyNow}
          disabled={loading}
          className="bg-white text-orange-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-50 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:hover:shadow-none flex items-center gap-2"
        >
          {loading ? "Sending..." : "Verify Now"}
        </button>
        <button
          onClick={handleDismiss}
          className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors duration-200"
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
