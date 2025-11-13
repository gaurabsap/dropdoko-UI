"use client";

import AddToCartButton from "@/components/AddToCartButton";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: { url: string }[];
}

export default function ProductActions({ product }: { product: Product }) {
  // Extract only the needed fields to avoid hydration issues
  const productData = {
    _id: product._id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    images: product.images
  };

  return <AddToCartButton product={productData} />;
}