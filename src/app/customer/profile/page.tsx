/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";
import { useUser } from "@/components/context/userContext"; // adjust path


interface UploadedImage {
  url: string;
  public_id: string;
}


export default function AccountDetailsPage() {
  const { user } = useUser();

  const [profileImage, setProfileImage] = useState("/profile.png");
  const [file, setFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // prefill when user changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhoneNumber((user as any).phoneNumber || "");
      setGender((user as any).gender || "");
      setProfileImage(user.profile || "/profile.png");
    }
  }, [user]);

  /** Upload file to Cloudinary via signed upload */
  const uploadProfileImage = async (file: File): Promise<UploadedImage | null> => {
    try {
      // ask your server for a signed upload
      const sigRes = await api.get("/cloudinary/upload-signature");
      const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("api_key", apiKey);
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Cloudinary error:", data);
        return null;
      }
      return { url: data.secure_url, public_id: data.public_id };
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };



  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const f = e.target.files[0];
    setFile(f);
    setProfileImage(URL.createObjectURL(f));
  };

  const handleEdit = () => setIsEditing(true);



  
  const handleSave = async () => {
    setSaving(true);
    try {
      let imageUrl = profileImage;

      if (file) {
        const uploaded = await uploadProfileImage(file);
        if (!uploaded) throw new Error("Image upload failed");
        imageUrl = uploaded.url;
      }

      await api.post("/auth/edit-profile", {
        fullName: fullName,
        phoneNumber,
        gender,
        profile: imageUrl,
      });

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fffdfb] p-6">
      <div className="w-full max-w-5xl">
        {/* Title */}
        <h1 className="text-2xl font-bold text-orange-600 mb-6">
          Account details
        </h1>

        {/* Card */}
        <div className="w-full bg-[#fcf8f4] border border-orange-200 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Profile Section */}
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="w-32 h-40 md:w-40 md:h-40 rounded-lg overflow-hidden">
              <Image
                src={profileImage}
                alt="Profile"
                width={160}
                height={260}
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-sm">Change profile</p>
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="profileFile"
              disabled={!isEditing}
            />
            <label
              htmlFor="profileFile"
              className={`mt-2 px-5 py-1 border border-orange-500 text-orange-500 rounded-full text-sm hover:bg-orange-100 cursor-pointer ${
                !isEditing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Browse
            </label>
          </div>

          {/* Input Section */}
          <div className="flex-1 w-full">
            <h2 className="text-lg font-semibold text-orange-600 mb-6">
              Personal Information:
            </h2>

            <div className="grid gap-5">
              <div>
                <label className="block text-sm mb-1">Full name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Phone number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Gender</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      disabled={!isEditing}
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      disabled={!isEditing}
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={handleEdit}
                disabled={isEditing}
                className={`bg-orange-600 text-white px-6 py-2 rounded-full transition ${
                  isEditing
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-700"
                }`}
              >
                Edit profile
              </button>
              <button
                onClick={handleSave}
                disabled={!isEditing || saving}
                className={`border border-orange-500 text-orange-500 px-6 py-2 rounded-full transition ${
                  !isEditing || saving
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-100"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
