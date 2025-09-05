// app/product/[slug]/page.tsx
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import api from "@/tools/axiosClient";
import ProductGallery from "@/components/ProductGallery"; // client component for gallery

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  specifications: string[];
  images: { url: string }[];
  slug: string;
  rating?: number;
  reviews?: { user: string; comment: string; rating: number }[];
}

export async function generateStaticParams() {
  try {
    const res = await api.get("/products/list");
    const products: { slug: string }[] = res.data.products || [];
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug || slug.toLowerCase() === "favicon.ico") {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  let product: Product | null = null;
  try {
    const res = await api.get(`/products/slug/${encodeURIComponent(slug)}`);
    product = res.data.data;
  } catch {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        Home / <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image gallery (client) */}
        <div className="md:w-1/2">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Product info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {product.rating && (
            <div className="flex items-center gap-2">
              <p className="text-yellow-500">
                {"★".repeat(Math.floor(product.rating))}
              </p>
              <span className="text-gray-400 text-sm">
                ({product.reviews?.length || 0} ratings)
              </span>
            </div>
          )}

          <p className="text-xl font-bold text-orange-600">
            Rs. {product.price.toLocaleString()} /-
          </p>

          <p className="text-gray-700">{product.description}</p>

          <div className="flex gap-3 mt-4">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition">
              Buy Now
            </button>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-orange-500 mb-4">Product description</h2>
        <p className="text-gray-700 mb-6">{product.description}</p>

        <h2 className="text-2xl font-bold text-orange-500 mb-2">Key Features</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          {product.features?.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-orange-500 mb-2">Technical Specifications</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          {product.specifications?.map((spec, i) => (
            <li key={i}>{spec}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-orange-500 mb-2">Customer Reviews</h2>
        {product.reviews?.length ? (
          <ul className="space-y-4">
            {product.reviews.map((rev, i) => (
              <li key={i} className="border-b pb-2">
                <p className="font-bold">{rev.user}</p>
                <p className="text-yellow-500">{"★".repeat(rev.rating)}</p>
                <p className="text-gray-700">{rev.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
