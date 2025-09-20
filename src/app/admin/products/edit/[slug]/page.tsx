"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/tools/axiosClient";
import ProductUpload from "@/components/admin/ProductUpload";

export default function EditProductPage() {
  const { slug } = useParams(); // now this will have the product ID
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (slug) {
      api.get(`/products/slug/${slug}`).then(res => setProduct(res.data.data));
    }
  }, [slug]);

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
    <ProductUpload
      existingProduct={product}
      onSubmit={async (data) => {
        await api.put(`/products/update/${slug}`, data);
        router.push("/admin/products");
      }}
    />
  );
}
