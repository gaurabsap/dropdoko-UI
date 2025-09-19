"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "./context/CartContext";
import { useUser } from "./context/userContext";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: { url: string }[];
}

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const { user } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const increase = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
    else toast.info(`Only ${product.stock} item(s) in stock.`);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    if (!user) return toast.info("Please log in to add items to cart");
    if (product.stock === 0) return toast.error("Product out of stock");

    setLoading(true);
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0]?.url || "",
        quantity,
      });
      toast.success(`${quantity} x ${product.name} added to cart.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 w-max">
      {/* Quantity row */}
      <div className="flex items-center border rounded-md overflow-hidden">
        Quantity
        <button
          onClick={decrease}
          disabled={quantity <= 1}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
        >
          -
        </button>
        <span className="px-6 py-2 bg-white text-gray-800">{quantity}</span>
        <button
          onClick={increase}
          disabled={quantity >= product.stock}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Buttons row */}
      <div className="flex gap-2">
        <button
          onClick={() => toast.info("Buy Now clicked")}
          className="bg-orange-500 text-white px-6 py-2 rounded-md  font-medium hover:bg-orange-600 transition"
        >
          Buy Now
        </button>
        <button
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition disabled:opacity-50"
        >
          {loading ? "Adding..." : <><ShoppingCart size={18} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}
