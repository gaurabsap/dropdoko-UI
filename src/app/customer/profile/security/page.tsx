"use client";
import { useEffect, useState } from "react";
import api from "@/tools/axiosClient";
import { useUser } from "@/components/context/userContext";
import { Eye, EyeOff } from "lucide-react"; // 👈 import icons

export default function SecurityPage() {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 👁️ visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };


    const handleEmailChange = async () => {
    if (!email) return setMessage("Please enter a valid email.");

    try {
      setEmailLoading(true);
      setMessage("");
      await api.put("/auth/change-email", { email }); // 👈 backend route
      setMessage("Email updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update email.");
    } finally {
      setEmailLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#fffaf6] flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        {/* Security Title */}
        <h1 className="text-2xl font-bold text-orange-500 mb-6">Security</h1>

        {/* Email Section */}
        <div className="mb-10">
          <label className="block text-gray-800 font-semibold mb-2">Email</label>
          <div className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-[#f9f9f9] text-gray-700"
            />
            <button
              onClick={handleEmailChange}
              disabled={emailLoading}
              className="self-end bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-60"
            >
              {emailLoading ? "Updating..." : "Update Email"}
            </button>
            {/* <button
              className="text-orange-500 text-end font-semibold hover:underline">
              Change Email
            </button> */}
          </div>
        </div>

        {/* Change Password Section */}
        <form
          onSubmit={handlePasswordChange}
          className="border border-orange-200 rounded-2xl p-6 md:p-8 bg-white shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Change Password
          </h2>

          {/* Current password */}
          <div className="mb-5 relative">
            <label className="block text-gray-800 font-medium mb-1">
              Current password
            </label>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full border border-orange-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-[41px] text-gray-500 hover:text-gray-700"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New password */}
          <div className="mb-5 relative">
            <label className="block text-gray-800 font-medium mb-1">
              New password
            </label>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-orange-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-[41px] text-gray-500 hover:text-gray-700"
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm password */}
          <div className="mb-6 relative">
            <label className="block text-gray-800 font-medium mb-1">
              Confirm password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-orange-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-[41px] text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-sm mb-4 ${
                message.includes("success") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Change password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
