"use client";

import { useState, ChangeEvent, useRef } from "react";
import api from "@/tools/axiosClient";
import Image from "next/image";
import { toast } from "react-toastify";
import { X, Plus, Upload } from "lucide-react";

type ImageType = { url: string; public_id: string };
type TechSpec = { label: string; value: string };

export default function ProductUpload() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: name === "stock" ? parseInt(value) : value,
    }));
  };

  // feature
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

  // tech
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

  // box
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

  // images
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

  // gallery
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
      if (res.ok) uploaded.push({ url: data.secure_url, public_id: data.public_id });
    }
    return uploaded;
  };

  const handleSubmit = async () => {
    if (!productData.name || !productData.price) {
      toast.error("Name and Price required");
      return;
    }
    setLoading(true);
    try {
      const uploadedMain = await uploadToCloudinary(selectedFiles);
      const uploadedGallery = await uploadToCloudinary(galleryFiles);
      const payload = {
        ...productData,
        images: uploadedMain,
        gallery: uploadedGallery,
      };
      await api.post("/products/create", payload);
      toast.success("Product added");
      setSelectedFiles([]);
      setMainPreviews([]);
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setProductData({
        name: "",
        description: "",
        price: "",
        discountedPrice: "",
        stock: 0,
        keyFeatures: [],
        technicalSpecifications: [],
        boxContents: [],
      });
      setFeatureInput("");
      setTechInput({ label: "", value: "" });
      setBoxInput("");
      setLoading(false);
      
    } catch (e) {
      console.error(e);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 mb-8">
      <div className="border-b border-orange-200 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-orange-600 text-center">Add New Product</h2>
        <p className="text-gray-600 text-center mt-2">Fill in the details to add a new product to your catalog</p>
      </div>

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
      </div>

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
          <label className="block text-sm font-medium text-orange-700 mb-1">Discounted Price</label>
          <input
            type="number"
            name="discountedPrice"
            value={productData.discountedPrice}
            onChange={handleChange}
            className="w-full border border-orange-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="0.00"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
          <input
            type="text"
            placeholder="Specification label"
            value={techInput.label}
            onChange={(e) => setTechInput({ ...techInput, label: e.target.value })}
            className="border border-orange-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
          <input
            type="text"
            placeholder="Specification value"
            value={techInput.value}
            onChange={(e) => setTechInput({ ...techInput, value: e.target.value })}
            className="border border-orange-200 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
          <button 
            onClick={addTech} 
            className="px-4 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} className="mr-1" /> Add
          </button>
        </div>
      </div>

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

      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">Product Images</h3>
        <label className="block mb-2 text-sm text-orange-700">Select main product images</label>
        <div className="flex items-center justify-center w-full mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-orange-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-orange-500" />
              <p className="mb-2 text-sm text-orange-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
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

      <div className="bg-orange-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">Gallery Images</h3>
        <label className="block mb-2 text-sm text-orange-700">Additional product images</label>
        <div className="flex gap-4 overflow-x-auto py-2 items-center">
          {galleryPreviews.map((src, idx) => (
            <div key={idx} className="flex-shrink-0 w-28 h-28 relative group">
              <Image src={src} alt="gallery" fill className="object-cover rounded-lg shadow-md" />
              <button
                onClick={() => removeGalleryPreview(idx)}
                className="absolute top-1 right-1 bg-orange-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="flex-shrink-0 w-28 h-28 flex items-center justify-center border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-white hover:bg-orange-50 transition-colors"
          >
            <Plus className="text-orange-500" size={24} />
          </div>
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

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-semibold rounded-lg shadow-md hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            "Create Product"
          )}
        </button>
      </div>
    </div>
  );
}