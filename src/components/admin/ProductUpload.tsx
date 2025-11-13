/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import api from "@/tools/axiosClient";
import Image from "next/image";
import { toast } from "react-toastify";
import { X, Plus, Upload } from "lucide-react";

type ImageType = { url: string; public_id?: string };
type TechSpec = { label: string; value: string };

type Props = {
  existingProduct?: any;
  onSubmit?: (data: any) => Promise<void>;
};

export default function ProductUpload({ existingProduct, onSubmit }: Props) {
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    discountPercentage: 0,
    stock: 0,
    keyFeatures: [] as string[],
    technicalSpecifications: [] as TechSpec[],
    boxContents: [] as string[],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState<TechSpec>({ label: "", value: "" });
  const [boxInput, setBoxInput] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mainPreviews, setMainPreviews] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  // ---- Populate state when editing ----
  useEffect(() => {
    if (existingProduct) {
      setProductData({
        name: existingProduct.name || "",
        category: existingProduct.category || "",
        description: existingProduct.description || "",
        price: existingProduct.price || "",
        discountPercentage: existingProduct.discountPercentage || 0,
        stock: existingProduct.stock || 0,
        keyFeatures: existingProduct.keyFeatures || [],
        technicalSpecifications: existingProduct.technicalSpecifications || [],
        boxContents: existingProduct.boxContents || [],
      });

      if (existingProduct.images) {
        setMainPreviews(existingProduct.images.map((img: ImageType) => img.url));
      }

      if (existingProduct.gallery) {
        setGalleryPreviews(existingProduct.gallery.map((img: ImageType) => img.url));
      }
    }
  }, [existingProduct]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) : value,
    }));
  };

  // ---- Key Features ----
  const addFeature = () => {
    if (!featureInput.trim()) return;
    setProductData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, featureInput.trim()],
    }));
    setFeatureInput("");
  };
  const removeFeature = (i: number) =>
    setProductData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, idx) => idx !== i),
    }));

  // ---- Technical Specs ----
  const addTech = () => {
    if (!techInput.label.trim() || !techInput.value.trim()) return;
    setProductData((prev) => ({
      ...prev,
      technicalSpecifications: [...prev.technicalSpecifications, techInput],
    }));
    setTechInput({ label: "", value: "" });
  };
  const removeTech = (i: number) =>
    setProductData((prev) => ({
      ...prev,
      technicalSpecifications: prev.technicalSpecifications.filter((_, idx) => idx !== i),
    }));

  // ---- Box Contents ----
  const addBox = () => {
    if (!boxInput.trim()) return;
    setProductData((prev) => ({
      ...prev,
      boxContents: [...prev.boxContents, boxInput.trim()],
    }));
    setBoxInput("");
  };
  const removeBox = (i: number) =>
    setProductData((prev) => ({
      ...prev,
      boxContents: prev.boxContents.filter((_, idx) => idx !== i),
    }));

  // ---- Image Selection ----
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setMainPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };
  const removeMainPreview = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setMainPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGallerySelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };
  const removeGalleryPreview = (idx: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---- Upload to Cloudinary ----
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

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) uploaded.push({ url: data.secure_url, public_id: data.public_id });
    }
    return uploaded;
  };

  // ---- Submit ----
  // ---- Submit ----
  const handleSubmit = async () => {
    if (!productData.name || !productData.price) {
      toast.error("Name and Price required");
      return;
    }

    setLoading(true);
    try {
      // Upload only new files
      const uploadedMain = await uploadToCloudinary(selectedFiles); // new main images
      const uploadedGallery = await uploadToCloudinary(galleryFiles); // new gallery images

      // Combine existing URLs that are still in mainPreviews/galleryPreviews
      const mainImagesPayload = [
        ...mainPreviews
          .map((url) => {
            // check if this url exists in existingProduct.images
            const existing = existingProduct?.images?.find((img: ImageType) => img.url === url);
            if (existing) return { url: existing.url, public_id: existing.public_id };
            return null;
          })
          .filter(Boolean),
        ...uploadedMain, // newly uploaded images already have url & public_id
      ];

      const galleryImagesPayload = [
        ...galleryPreviews
          .map((url) => {
            const existing = existingProduct?.gallery?.find((img: ImageType) => img.url === url);
            if (existing) return { url: existing.url, public_id: existing.public_id };
            return null;
          })
          .filter(Boolean),
        ...uploadedGallery,
      ];

      const payload = {
        ...productData,
        images: mainImagesPayload,
        gallery: galleryImagesPayload,
      };

      if (onSubmit) {
        await onSubmit(payload); // edit mode
      } else {
        await api.post("/products/create", payload); // add mode
        toast.success("Product added");
        setProductData({
          name: "",
          category: "",
          description: "",
          price: "",
          discountPercentage: 0,
          stock: 0,
          keyFeatures: [],
          technicalSpecifications: [],
          boxContents: [],
        });
        setMainPreviews([]);
        setGalleryPreviews([]);
        setSelectedFiles([]);
        setGalleryFiles([]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 mb-8">
      <div className="border-b border-orange-200 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-orange-600 text-center">
          {existingProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <p className="text-gray-600 text-center mt-2">
          Fill in the details to {existingProduct ? "update" : "add"} your product
        </p>
      </div>

      {/* Product Name & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Product Name *</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="e.g. Electronics, Fashion, Accessories"
          />
        </div>
      </div>

      {/* Stock */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-orange-700 mb-1">Stock Quantity</label>
        <input
          type="number"
          name="stock"
          value={productData.stock}
          onChange={handleChange}
          className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          placeholder="Enter stock quantity"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-orange-700 mb-1">Description</label>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          rows={4}
          placeholder="Enter product description"
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Price *</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="0.00"
          />
        </div>        
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Discount %</label>
          <input
            type="number"
            name="discountPercentage"
            value={productData.discountPercentage}
            onChange={handleChange}
            className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-orange-700 mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="0"
          />
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">Key Features</h3>
        {productData.keyFeatures.map((f, i) => (
          <div key={i} className="flex items-center gap-2 mb-2 bg-white p-2 rounded-md">
            <span className="flex-1 text-gray-700">{f}</span>
            <button
              onClick={() => removeFeature(i)}
              className="text-orange-600 hover:text-orange-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="Add a feature"
            className="flex-1 border border-orange-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
          <button
            onClick={addFeature}
            className="px-4 bg-orange-500 text-white rounded-lg flex items-center hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} className="mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">Technical Specifications</h3>
        {productData.technicalSpecifications.map((t, i) => (
          <div key={i} className="flex items-center gap-2 mb-2 bg-white p-2 rounded-md">
            <span className="flex-1 text-gray-700">
              <span className="font-medium">{t.label}:</span> {t.value}
            </span>
            <button
              onClick={() => removeTech(i)}
              className="text-orange-600 hover:text-orange-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3 items-end">
          <input
            type="text"
            placeholder="Specification label"
            value={techInput.label}
            onChange={(e) => setTechInput({ ...techInput, label: e.target.value })}
            className="col-span-2 border border-orange-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition w-full"
          />
          <input
            type="text"
            placeholder="Specification value"
            value={techInput.value}
            onChange={(e) => setTechInput({ ...techInput, value: e.target.value })}
            className="col-span-2 border border-orange-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition w-full"
          />
          <button
            onClick={addTech}
            className="w-20 h-10 bg-orange-500 text-white rounded-lg flex flex-row-reverse items-center justify-center hover:bg-orange-600 transition-colors self-start"
          >
            Add <Plus size={18} />
          </button>
        </div>
      </div>


      {/* Box Contents */}
      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">Box Contents</h3>
        {productData.boxContents.map((b, i) => (
          <div key={i} className="flex items-center gap-2 mb-2 bg-white p-2 rounded-md">
            <span className="flex-1 text-gray-700">{b}</span>
            <button
              onClick={() => removeBox(i)}
              className="text-orange-600 hover:text-orange-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={boxInput}
            onChange={(e) => setBoxInput(e.target.value)}
            placeholder="Add an item"
            className="flex-1 border border-orange-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
          <button
            onClick={addBox}
            className="px-4 bg-orange-500 text-white rounded-lg flex items-center hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} className="mr-1" /> Add
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">Product Images</h3>
        <label className="block mb-2 text-sm text-orange-700">Select main product images</label>
        <div className="flex items-center justify-center w-full mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-orange-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-orange-500" />
              <p className="mb-2 text-sm text-orange-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-orange-500">SVG, PNG, JPG or GIF (MAX. 5MB each)</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>
        <div className="flex flex-wrap gap-4">
          {mainPreviews.map((src, idx) => (
            <div key={idx} className="w-28 h-28 relative group">
              <Image src={src} alt="preview" fill className="object-cover rounded-lg shadow-md" />
              <button
                onClick={() => removeMainPreview(idx)}
                className="absolute top-1 right-1 bg-orange-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Images */}
      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">Gallery Images</h3>
        <div className="flex gap-4 overflow-x-auto py-2 items-center">
          {galleryPreviews.map((src, idx) => (
            <div key={idx} className="flex-shrink-0 w-28 h-28 relative group">
              <Image src={src} alt="preview" fill className="object-cover rounded-lg shadow-md" />
              <button
                onClick={() => removeGalleryPreview(idx)}
                className="absolute top-1 right-1 bg-orange-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex-shrink-0 w-28 h-28 border-2 border-orange-300 border-dashed rounded-lg flex flex-col items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors"
          >
            <Upload size={24} />
            <span className="text-xs mt-1">Add More</span>
          </button>
          <input
            type="file"
            ref={galleryInputRef}
            multiple
            accept="image/*"
            onChange={handleGallerySelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium shadow-md transition-colors"
      >
        {loading ? "Uploading..." : existingProduct ? "Update Product" : "Add Product"}
      </button>
    </div>
  );
}
