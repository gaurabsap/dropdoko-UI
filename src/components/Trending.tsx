/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./context/CartContext";
import { useUser } from "./context/userContext";
import { useState, useEffect } from "react";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  images: { url: string }[];
}

// Skeleton Loading Component
const ProductSkeleton = () => (
  <div className="flex flex-col items-center">
    <div className="relative aspect-square w-44 md:w-56 rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse" />
    <div className="mt-4 w-32 h-4 bg-gray-200 rounded animate-pulse" />
  </div>
);

export default function Trending() {
  const { addToCart } = useCart();
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/list");
        setProducts(response.data.products);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.info("Please log in to add items to your cart");
      return;
    }
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0].url,
    });
  };

  if (error) {
    return (
      <section className="py-8 px-4 md:px-12">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center md:text-left">
            Trending products:
          </h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 w-full">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800 text-center md:text-left">
          Trending products:
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
            : products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 w-full max-w-[220px] p-3 border border-gray-300 rounded-xl shadow-md"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="group relative aspect-square w-full rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      width={500}
                      height={500}
                      unoptimized
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-gray-800 text-white p-2 rounded-full shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart size={16} />
                    </div>
                  </div>
                </Link>

                  <p className="mt-3 font-semibold text-xs sm:text-sm md:text-base text-gray-800 line-clamp-2">
                    {product.name}
                  </p>

                  {/* Price */}
                  <p className="text-start text-[#ED6E0A] font-bold text-sm sm:text-base">
                    Rs. {product.price}
                  </p>

                  {/* Button */}
                  <button
                    className="px-3 py-2 w-full bg-[#ED6E0A] rounded-xl text-white text-xs sm:text-sm md:text-base hover:bg-orange-600 transition-colors duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                  >
                    Add to cart
                  </button>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
}
