/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";
import { useUser } from "../context/userContext";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: { id: string; name: string; price: number; imageUrl: string; quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  buyNowItem: CartItem | null;
  setBuyNowProduct: (product: any, quantity?: number) => void;
  clearBuyNowItem: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }
      try {
        const res = await api.get("/cart/getAll");
        const items = res.data.data.items.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.images[0]?.url || "",
        }));
        setCart(items);
      } catch (err) {
        console.error("Failed to fetch cart", err);
        setCart([]);
      }
    };

    fetchCart();
  }, [user]);

  // Add or update quantity
  const addToCart = async (item: { id: string; name: string; price: number; imageUrl: string; quantity?: number }) => {
    const qty = item.quantity ?? 1;
    console.log(item)
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev
          .map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + qty } : i))
          .filter((i) => i.quantity > 0);
      } else {
        return [...prev, { ...item, quantity: qty }];
      }
    });

    try {
      await api.post("/cart/add", { productId: item.id, quantity: qty });
    } catch (err: any) {
      console.error("Add to cart failed", err);
      toast.error(err.response?.data?.error || "Failed to update cart");
    }
  };

  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));

    try {
      await api.delete(`/cart/remove/${productId}`);
      // toast.info("Item removed from cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await api.delete("/cart/clear");
      setCart([]);
      // toast.info("Cart cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart");
    }
  };

    const setBuyNowProduct = (product: any, quantity: number = 1) => {
    const buyNowProduct: CartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl || product.images?.[0]?.url || ""
    };
    setBuyNowItem(buyNowProduct);
  };

  const clearBuyNowItem = () => {
    setBuyNowItem(null);
  };



  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, buyNowItem, setBuyNowProduct, clearBuyNowItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
