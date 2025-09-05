/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "./context/CartContext";
import { useState, useEffect } from "react";
import api from "@/tools/axiosClient";

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string; // slug coming from API
  images: { url: string }[];
}

// Skeleton Loading Component
const ProductSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-[calc(50%-12px)] md:w-auto">
      <div className="relative aspect-square w-48 md:w-56 rounded-lg overflow-hidden shadow-md bg-gray-200 animate-pulse"></div>
      <div className="mt-4 w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
};

export default function Trending() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/list");
        console.log(response.data);
        setProducts(response.data.products);
      } catch (err: any ) {
        setError(err.message || "Something went wrong");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <section className="py-8 px-4 md:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 md:mb-12 text-gray-50 text-center md:text-left">
            Trending products:
          </h2>
          <div className="text-center text-red-500">
            Error loading products: {error}
          </div>
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
            ? Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col items-center w-[calc(50%-12px)] md:w-auto"
                >
                  {/* Wrap image & name in Link to /product/[slug] */}
                  <Link href={`/product/${product.slug}`} className="w-full">
                    <div className="relative aspect-square w-45 md:w-56 rounded-lg overflow-hidden shadow-md group hover:scale-105 transition-transform duration-300">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-4 font-bold text-sm md:text-base text-gray-800 text-center">
                      {product.name.split(" ").slice(0, 2).join(" ")}
                    </p>
                  </Link>

                  {/* Add to cart button */}
                  <button
                    className="mt-2 cursor-pointer flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-full shadow-md text-sm font-medium transition-opacity duration-300 hover:bg-gray-700"
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        imageUrl: product.images[0].url,
                      })
                    }
                  >
                    <Plus size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
