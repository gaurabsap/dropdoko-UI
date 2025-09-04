"use client";
/* eslint-disable */

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "./context/CartContext";

const categories = [
  {
    id: "1",
    price: 29.99,
    title: "Smart Home Devices",
    image: "/hello2.png",
  },
  {
    id: "2",
    price: 19.99,
    title: "Useful Decorations",
    image: "/prod2.png",
  },
  {
    id: "3",
    price: 39.99,
    title: "Everyday Essentials",
    image: "/prod4.png",
  },
  {
    id: "4",
    price: 49.99,
    title: "Gifts collection",
    image: "/prod4.png",
  },
];

export default function Trending() {
  const { addToCart } = useCart();
  return (
    <section className="py-8 px-4 md:px-12">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8 md:mb-12 text-gray-800 text-center md:text-left">
          Trending products:
        </h2>
        <div className="flex flex-wrap justify-center md:justify-between gap-6 md:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="flex flex-col items-center w-[calc(50%-12px)] md:w-auto"
            >
              <div className="relative aspect-square w-48 md:w-56 rounded-lg overflow-hidden shadow-md group hover:scale-105 transition-transform duration-300">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />

                {/* Add to cart button + text */}
                <button
                  className="cursor-pointer absolute bottom-2 right-2 flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded-full shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-700"
                  onClick={() =>
                    addToCart({
                      id: cat.id,
                      name: cat.title,
                      price: cat.price,
                      quantity: 1,
                      imageUrl: cat.image,
                    })
                  }
                >
                  <Plus size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>

              <p className="mt-4 font-bold text-sm md:text-base text-gray-800 text-center">
                {cat.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
