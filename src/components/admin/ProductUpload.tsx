"use client";

import { useState, ChangeEvent, useRef } from "react";
import api from "@/tools/axiosClient";
import Image from "next/image";
import { toast } from "react-toastify";

type ImageType = {
  url: string;
  public_id: string;
};

type ProductType = {
  name: string;
  description: string;
  price: number | "";
  discountedPrice: number | "";
  stock: number;
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
    stock: 0,
    categories: [],
    seo: { metaTitle: "", metaDescription: "", keywords: [] },
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mainPreviews, setMainPreviews] = useState<string[]>([]);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [mainImages, setMainImages] = useState<ImageType[]>([]);
  const [galleryImages, setGalleryImages] = useState<ImageType[]>([]);

  const [loading, setLoading] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ---------- Handlers ----------
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) : value,
    }));
  };

  // Main images selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setMainPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // Gallery images selection
  const handleGallerySelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
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
        { method: "POST", body: formData }
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

  // ---------- Submit ----------
  const handleSubmit = async () => {
    if (!productData.name || !productData.price) {
      toast.error("Name and Price are required.");
      return;
    }

    setLoading(true);
    try {
      const uploadedMain = await uploadToCloudinary(selectedFiles);
      const uploadedGallery = await uploadToCloudinary(galleryFiles);

      setMainImages(uploadedMain);
      setGalleryImages((prev) => [...prev, ...uploadedGallery]);

      const payload = {
        ...productData,
        images: uploadedMain,
        gallery: [...galleryImages, ...uploadedGallery],
      };

      await api.post("/products/create", payload);

      // Reset form
      setProductData({
        name: "",
        description: "",
        price: "",
        discountedPrice: "",
        stock: 0,
        categories: [],
        seo: { metaTitle: "", metaDescription: "", keywords: [] },
      });
      setSelectedFiles([]);
      setMainPreviews([]);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setMainImages([]);
      setGalleryImages([]);

      toast.success("Product added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

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
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={productData.stock}
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
          accept="image/*"
          onChange={handleFileSelect}
          className="mb-4 border-2"
        />
        <div className="flex gap-4 flex-wrap">
          {mainPreviews.map((src, idx) => (
            <div key={idx} className="w-28 h-28 relative rounded-lg shadow-sm">
              <Image
                src={src}
                alt={`main-preview-${idx}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Images with "+" button */}
      <div className="mt-8">
        <h3 className="font-semibold text-orange-600 mb-3">Gallery Images</h3>

        <div className="flex gap-4 overflow-x-auto py-2 items-center">
          {galleryPreviews.map((src, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-28 h-28 relative rounded-lg shadow-sm"
            >
              <Image
                src={src}
                alt={`gallery-preview-${idx}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}

          {/* Plus button */}
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="flex-shrink-0 w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <span className="text-3xl font-bold text-gray-500">+</span>
          </div>

          {/* Hidden file input for gallery */}
          <input
            type="file"
            multiple
            accept="image/*"
            ref={galleryInputRef}
            onChange={handleGallerySelect}
            className="hidden"
          />
        </div>
      </div>

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
