"use client";

import { useState, ChangeEvent } from "react";
import api from "@/tools/axiosClient";
import Image from "next/image";

type ImageType = {
  url: string;
  public_id: string;
};

type ProductType = {
  name: string;
  description: string;
  price: number | "";
  discountedPrice: number | "";
  categories?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
};

export default function ProductUpload() {
  const [productData, setProductData] = useState<ProductType>({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    categories: [],
    seo: { metaTitle: "", metaDescription: "", keywords: [] },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mainImages, setMainImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------- Handlers ----------
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Cloudinary Upload ----------
  const uploadToCloudinary = async (files: File[]) => {
    if (!files.length) return [];

    const sigRes = await api.get("/cloudinary/upload-signature");
    const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

    const uploaded: ImageType[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("api_key", apiKey);
      formData.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("Cloudinary error:", data);
        continue;
      }

      uploaded.push({ url: data.secure_url, public_id: data.public_id });
    }

    return uploaded;
  };

  // ---------- File Selection ----------
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // ---------- Submit Product ----------
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Upload images here on submit
      const uploaded = await uploadToCloudinary(selectedFiles);
      setMainImages(uploaded);

      const payload = { ...productData, images: uploaded };
      const res = await api.post("/products/create", payload);
      console.log("✅ Product created:", res.data);
    } catch (err) {
      console.error("❌ Product creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-12">
      <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center">
        Add New Product
      </h2>

      {/* Product Info */}
      <div className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 transition"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 transition"
          rows={4}
        />
        <div className="flex gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 transition"
          />
          <input
            type="number"
            name="discountedPrice"
            placeholder="Discounted Price"
            value={productData.discountedPrice}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>
      </div>

      {/* Main Images */}
      <div className="mt-8">
        <h3 className="font-semibold text-orange-600 mb-3">Product Images</h3>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="mb-4 border-2"
        />
        {loading && <p className="text-gray-500">Uploading...</p>}
        <div className="flex gap-4 flex-wrap">
          {mainImages.map((img) => (
            <Image
              key={img.public_id}
              src={img.url}
              alt="main"
              width={112}
              height={112}
              className="w-28 h-28 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-8 w-full bg-orange-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-orange-700 transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </div>
  );
}