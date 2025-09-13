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
  <div className="flex flex-col items-center w-[calc(50%-12px)] md:w-auto">
    <div className="relative aspect-square w-48 md:w-56 rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse"></div>
    <div className="mt-4 w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
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

    // If logged in, add to cart
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
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 md:mb-12 text-center md:text-left">
            Trending products:
          </h2>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 md:px-12">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12 text-gray-800 text-center md:text-left">
          Trending products:
        </h2>
        <div className="flex flex-wrap justify-center md:justify-between gap-6 md:gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
            : products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col items-center w-[calc(50%-12px)] md:w-auto group relative"
                >
                  <Link href={`/product/${product.slug}`} className="w-full">
                    <div className="relative aspect-square w-45 md:w-56 rounded-lg overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
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

                  <p className="mt-4 font-bold text-sm md:text-base text-gray-800 text-center">
                    {product.name.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
