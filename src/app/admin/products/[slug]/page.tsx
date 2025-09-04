"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/tools/axiosClient";

type ImageType = {
  url: string;
  public_id: string;
};

type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number | "";
  discountedPrice: number | "";
  stock: number | "";
  categories: string[];
  images: ImageType[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [productData, setProductData] = useState<ProductType>({
    id: "",
    name: "",
    description: "",
    price: "",
    discountedPrice: "",
    stock: "",
    categories: [],
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [newImages, setNewImages] = useState<ImageType[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      // Fetch product data
      fetchProductData();
    }
  }, [router, productId]);

  const fetchProductData = async () => {
    try {
      // In a real app, you would fetch from your API
      // const res = await api.get(`/products/${productId}`);
      // setProductData(res.data);
      
      // Mock data for demonstration
      setTimeout(() => {
        setProductData({
          id: productId as string,
          name: "Premium Wireless Headphones",
          description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
          price: 199.99,
          discountedPrice: 179.99,
          stock: 45,
          categories: ["electronics", "audio"],
          images: [
            { url: "/placeholder-product-1.jpg", public_id: "prod1" },
            { url: "/placeholder-product-2.jpg", public_id: "prod2" }
          ]
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setLoading(false);
    }
  };

  // ---------- Handlers ----------
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setProductData((prev) => {
      if (checked) {
        return { ...prev, categories: [...prev.categories, value] };
      } else {
        return { 
          ...prev, 
          categories: prev.categories.filter(cat => cat !== value) 
        };
      }
    });
  };

  // ---------- Cloudinary Upload ----------
  const uploadToCloudinary = async (files: File[]) => {
    if (!files.length) return [];

    try {
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
    } catch (err) {
      console.error("Upload failed:", err);
      return [];
    }
  };

  // ---------- File Selection ----------
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // ---------- Remove Image ----------
  const handleRemoveImage = (publicId: string) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.public_id !== publicId)
    }));
  };

  // ---------- Submit Product ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Upload new images if any
      let uploaded: ImageType[] = [];
      if (selectedFiles.length > 0) {
        uploaded = await uploadToCloudinary(selectedFiles);
        setNewImages(uploaded);
      }

      // Combine existing images with new ones
      const allImages = [...productData.images, ...uploaded];

      const payload = { ...productData, images: allImages };
      
      // In a real app, you would make an API call here
      // const res = await api.put(`/products/${productId}`, payload);
      console.log("✅ Product updated:", payload);
      
      // Show success message
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("❌ Product update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div>
                <Link href="/admin" className="text-gray-400 hover:text-gray-500">
                  Dashboard
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link
                  href="/admin/products"
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Products
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-sm font-medium text-orange-600">
                  Edit Product
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Product
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            ID: {productData.id}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          Product updated successfully!
        </div>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="mt-8 space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={productData.name}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={productData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    value={productData.price}
                    onChange={handleChange}
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700">
                  Discounted Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="discountedPrice"
                    id="discountedPrice"
                    step="0.01"
                    value={productData.discountedPrice}
                    onChange={handleChange}
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock Quantity
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    value={productData.stock}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Categories</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="electronics"
                      name="categories"
                      type="checkbox"
                      value="electronics"
                      checked={productData.categories.includes("electronics")}
                      onChange={handleCategoryChange}
                      className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                    />
                    <label htmlFor="electronics" className="ml-3 block text-sm font-medium text-gray-700">
                      Electronics
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="audio"
                      name="categories"
                      type="checkbox"
                      value="audio"
                      checked={productData.categories.includes("audio")}
                      onChange={handleCategoryChange}
                      className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                    />
                    <label htmlFor="audio" className="ml-3 block text-sm font-medium text-gray-700">
                      Audio
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="accessories"
                      name="categories"
                      type="checkbox"
                      value="accessories"
                      checked={productData.categories.includes("accessories")}
                      onChange={handleCategoryChange}
                      className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                    />
                    <label htmlFor="accessories" className="ml-3 block text-sm font-medium text-gray-700">
                      Accessories
                    </label>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                
                {/* Existing Images */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Current images:</p>
                  <div className="flex flex-wrap gap-4">
                    {productData.images.map((img) => (
                      <div key={img.public_id} className="relative">
                        <Image
                          src={img.url}
                          alt="Product"
                          width={112}
                          height={112}
                          className="w-28 h-28 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.public_id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Images */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Add new images:</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>

                {/* New Images Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">New images to be uploaded:</p>
                    <div className="flex flex-wrap gap-4">
                      {Array.from(selectedFiles).map((file, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            width={112}
                            height={112}
                            className="w-28 h-28 object-cover rounded-lg shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}