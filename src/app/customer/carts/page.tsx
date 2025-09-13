"use client";

import Image from "next/image";
import { useCart } from "@/components/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500); // simulate loading
    return () => clearTimeout(timeout);
  }, []);

  const updateQuantity = (item: typeof cart[0], newQty: number) => {
    if (newQty < 1) {
      removeFromCart(item.id);
    } else {
      addToCart({ ...item, quantity: newQty - item.quantity });
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f9f6f1] min-h-screen flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold mb-6 animate-pulse bg-gray-200 h-10 w-60 rounded"></h1>
        <div className="w-full max-w-3xl space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-md border p-4 animate-pulse flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
          {/* Skeleton for Order Summary */}
          <div className="mt-8 bg-white rounded-md p-6 animate-pulse space-y-4">
            <div className="w-40 h-6 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-3 flex-wrap">
              <div className="w-40 h-10 bg-gray-300 rounded-md"></div>
              <div className="w-32 h-10 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="bg-[#f9f6f1] min-h-screen flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.99;
  const tax = 15.0;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-[#f9f6f1] min-h-screen flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="w-full max-w-3xl overflow-x-auto relative">
        {/* Table */}
        <div className="bg-white rounded-md border">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="text-gray-700">
              <tr className="border-b">
                <th className="py-3 pl-4">Product</th>
                <th className="py-3">Price</th>
                <th className="py-3">Quantity</th>
                <th className="py-3">Total</th>
                <th className="py-3 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b last:border-none">
                  <td className="py-4 pl-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </td>
                  <td className="py-4">Rs {item.price.toFixed(2)}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        className="px-2 text-gray-600 hover:text-black"
                      >
                        –
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        className="px-2 text-gray-600 hover:text-black"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-4 pr-4">Rs {(item.price * item.quantity).toFixed(2)}</td>
                  <td className="py-4 pr-4">
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete All Button under table */}
        {cart.length > 0 && (
          <div className="flex justify-end mt-4 w-full max-w-3xl">
            <Button
              onClick={() => {
                if (confirm("Are you sure you want to delete all items from the cart?")) {
                  clearCart();
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Delete All
            </Button>
          </div>
        )}

        {/* Order Summary */}
        <div className="mt-8 w-full lg:w-auto">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs {shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span>Rs {tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4">
            <span>Total</span>
            <span>Rs {total.toFixed(2)}</span>
          </div>

          <div className="flex justify-end mt-6 gap-3 flex-wrap">
            <Link
              href="/customer/checkout"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md"
            >
              Check out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
