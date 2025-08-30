// components/Providers.tsx
"use client";

import { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { UserProvider } from "./userContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </CartProvider>
    </UserProvider>
  );
}
