"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "./context/CartContext";
import { useUser } from "./context/userContext";
import { useRouter } from "next/navigation";

// Inside AddToCartButton
interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: { url: string }[];
}

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const router = useRouter();

  const { addToCart } = useCart();
  const { user } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const increase = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Increase clicked");
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.info(`Only ${product.stock} item(s) in stock.`);
    }
  };

  const decrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Decrease clicked");
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add to cart clicked");
    
    if (!user) return toast.info("Please log in to add items to cart");
    if (!product.stock || product.stock === 0) return toast.error("Product out of stock");

    setLoading(true);
    try {
      await addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0]?.url || "",
        quantity,
      });
      toast.success(`${quantity} x ${product.name} added to cart.`);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
if (!user) return toast.info("Please log in to buy items");

  if (!product.stock || product.stock === 0) return toast.error("Product out of stock");

  try {

 router.push(
    `/customer/checkout?buyNow=true&productId=${product._id}&quantity=${quantity}`
  );
  } catch (err) {
    console.error("Buy now error:", err);
    toast.error("Failed to proceed to checkout");
  }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 w-max">
      {/* Quantity row */}
      <div className="flex items-center rounded-md overflow-hidden">
        <span className="px-3">Quantity</span>
        <button
          onClick={decrease}
          disabled={quantity <= 1}
          className="px-4 py-2 cursor-pointer bg-gray-300 hover:bg-gray-200 transition disabled:opacity-50"
          type="button"
        >
          -
        </button>
        <span className="px-6 py-2 bg-white text-gray-800">{quantity}</span>
        <button
          onClick={increase}
          disabled={quantity >= product.stock}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-200 transition disabled:opacity-50"
          type="button"
        >
          +
        </button>
      </div>

      {/* Buttons row */}
      <div className="flex gap-2">
        <button
          onClick={handleBuyNow}
          className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition"
          type="button"
        >
          Buy Now
        </button>
        <button
          onClick={handleAddToCart}
          disabled={!product.stock || loading}
          className="flex items-center gap-2 px-6 py-2 text-orange-600 border-1 border-orange-600 hover:bg-orange-100 font-semibold rounded-md transition disabled:opacity-50"
          type="button"
        >
          {loading ? "Adding..." : <><ShoppingCart size={18} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}