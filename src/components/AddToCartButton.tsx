"use client";
import { Plus } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  const handleAddToCart = () => {
    console.log("Added to cart:", product.id);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-white text-orange-500 border border-orange-500 px-6 py-2 rounded-md font-medium hover:bg-orange-50 transition flex items-center gap-2"
    >
      <Plus size={16} /> Add to Cart
    </button>
  );
}
