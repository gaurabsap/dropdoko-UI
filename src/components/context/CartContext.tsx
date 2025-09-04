// context/CartContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axiosClient from "@/tools/axiosClient"; 
import { toast } from "react-toastify";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = async (item: CartItem) => {
    // ✅ Always update local cart immediately
    setCart((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...item, quantity: 1 }]
    );

    // Try syncing with backend, but don’t undo local update if it fails
    try {
      await axiosClient.post("/cart", item);
      toast.success(`${item.name} added to cart 🛒`);
    } catch (err) {
      console.error("❌ Failed to sync cart with API:", err);
      toast.error("Item added locally, but failed to sync with server");
    }
  };


  const removeFromCart = async (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));

    try {
      await axiosClient.delete(`/cart/${id}`);
      toast.info("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    setCart([]);

    try {
      await axiosClient.delete("/cart");
      toast.info("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast.error("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
