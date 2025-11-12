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
    const timeout = setTimeout(() => setLoading(false), 500);
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
      <div className="bg-orange-50 min-h-screen flex flex-col items-center py-6 sm:py-8 px-3 sm:px-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 animate-pulse bg-orange-200 h-8 w-40 rounded mx-auto text-center px-4 break-words"></h1>
        <div className="w-full max-w-3xl space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-md border border-orange-200 p-3 sm:p-4 animate-pulse flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-200 rounded-full"></div>
                <div className="w-24 sm:w-32 h-4 bg-orange-200 rounded"></div>
              </div>
              <div className="w-16 sm:w-20 h-4 bg-orange-200 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-200 rounded"></div>
                <div className="w-3 sm:w-4 h-4 bg-orange-200 rounded"></div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-200 rounded"></div>
              </div>
              <div className="w-16 sm:w-20 h-4 bg-orange-200 rounded"></div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-200 rounded"></div>
            </div>
          ))}
          {/* Skeleton for Order Summary */}
          <div className="mt-6 sm:mt-8 bg-white rounded-md border border-orange-200 p-4 sm:p-6 animate-pulse space-y-4">
            <div className="w-32 sm:w-40 h-5 sm:h-6 bg-orange-200 rounded"></div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="w-16 sm:w-20 h-4 bg-orange-200 rounded"></div>
                <div className="w-16 sm:w-20 h-4 bg-orange-200 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-16 sm:w-20 h-4 bg-orange-200 rounded"></div>
                <div className="w-16 sm:w-20 h-4 bg-orange-200 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-16 sm:w-20 h-4 bg-orange-200 rounded"></div>
                <div className="w-16 sm:w-20 h-4 bg-orange-200 rounded"></div>
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-3 flex-wrap">
              <div className="w-32 sm:w-40 h-8 sm:h-10 bg-orange-300 rounded-md"></div>
              <div className="w-24 sm:w-32 h-8 sm:h-10 bg-orange-300 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="bg-orange-50 min-h-screen flex flex-col items-center py-6 sm:py-8 px-3 sm:px-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-orange-800 mx-auto text-center px-4 break-words">Shopping Cart</h1>
        <p className="text-orange-600">Your cart is empty.</p>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.99;
  const total = subtotal + shipping

  return (
    <div className="bg-orange-50 min-h-screen flex flex-col items-center py-6 sm:py-8 px-3 sm:px-4">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-orange-800 mx-auto text-center px-4 break-words">Shopping Cart</h1>

      <div className="w-full max-w-6xl">
        {/* Desktop Table - Made more compact */}
        <div className="hidden lg:block bg-white rounded-md border border-orange-200">
          <table className="w-full text-left text-sm">
            <thead className="text-orange-800 bg-orange-100">
              <tr className="border-b border-orange-200">
                <th className="py-2 pl-4">Product</th>
                <th className="py-2">Price</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Total</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b border-orange-100 last:border-none hover:bg-orange-50">
                  <td className="py-3 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover rounded-full border border-orange-200"
                        />
                      </div>
                      <span className="font-medium text-orange-900 text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 whitespace-nowrap text-orange-700 text-sm">Rs {item.price.toFixed(2)}</td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        className="px-2 text-orange-600 hover:text-orange-800"
                      >
                        –
                      </button>
                      <span className="mx-2 text-orange-700 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        className="px-2 text-orange-600 hover:text-orange-800"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3 whitespace-nowrap text-orange-700 font-semibold text-sm">Rs {(item.price * item.quantity).toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-md"
                      size="sm"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet Layout (md and lg) */}
        <div className="hidden md:block lg:hidden space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-md border border-orange-200 p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-full border border-orange-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-orange-900 text-sm">{item.name}</h3>
                    <p className="text-orange-600 text-sm mt-1">Rs {item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-semibold whitespace-nowrap text-orange-700 mb-2">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </div>
                  <Button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-md"
                    size="sm"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    className="px-3 text-orange-600 hover:text-orange-800 text-lg"
                  >
                    –
                  </button>
                  <span className="mx-3 text-orange-700 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    className="px-3 text-orange-600 hover:text-orange-800 text-lg"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-orange-600">
                  Rs {item.price.toFixed(2)} each
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Cards (sm and below) */}
        <div className="md:hidden space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-md border border-orange-200 p-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-full border border-orange-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-orange-900 text-sm truncate">{item.name}</h3>
                    <p className="text-orange-600 text-xs mt-1">Rs {item.price.toFixed(2)} each</p>
                  </div>
                </div>
                <Button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-md flex-shrink-0 ml-2"
                  size="sm"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    className="px-2 text-orange-600 hover:text-orange-800 text-lg"
                  >
                    –
                  </button>
                  <span className="mx-2 text-orange-700 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    className="px-2 text-orange-600 hover:text-orange-800 text-lg"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap text-orange-700">
                  Rs {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete All Button - Better positioning */}
        {cart.length > 0 && (
          <div className="flex justify-center sm:justify-end mt-4 sm:mt-6">
            <Button
              onClick={() => {
                if (confirm("Are you sure you want to delete all items from the cart?")) {
                  clearCart();
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              size="sm"
            >
              Delete All Items
            </Button>
          </div>
        )}

        {/* Order Summary */}
        <div className="mt-6 sm:mt-8 bg-white rounded-md border border-orange-200 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-orange-800">Order Summary</h2>
          <div className="space-y-2 text-orange-700 text-sm sm:text-base">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="whitespace-nowrap">Rs {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="whitespace-nowrap">Rs {shipping.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold mt-3 sm:mt-4 text-orange-800">
            <span>Total</span>
            <span className="whitespace-nowrap">Rs {total.toFixed(2)}</span>
          </div>

          <div className="flex justify-center sm:justify-end mt-4 sm:mt-6">
            <Link
              href="/customer/checkout"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md text-center w-full sm:w-auto"
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}