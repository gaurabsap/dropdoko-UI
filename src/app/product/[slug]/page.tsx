/* eslint-disable @typescript-eslint/no-explicit-any */
// app/product/[slug]/page.tsx

/* eslint-disable */

import ProductActions from "@/components/ProductActions"
import api from "@/tools/axiosClient";
import ProductGallery from "@/components/ProductGallery";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewCard from "@/components/product/ReviewCard";

interface Review {
  user: { _id: string; fullName: string, profile?: string };
  rating: number;
  createdAt: string;
  profile?: string;
  likes?: number;
  dislikes?: number;
  review?: string;
  userVote?: "like" | "dislike" | "none";
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  discountedPrice?: number;
  discountPercentage: number;
  keyFeatures: (string | { label: string; value: string })[];
  technicalSpecifications: (string | { label: string; value: string })[];
  boxContents: (string | { label: string; value: string })[];
  stock: number;
  gallery: { url: string }[];
  images: { url: string }[];
  slug: string;
  rating?: number;
  ratingBreakdown?: { [stars: number]: number };
  reviews?: Review[];
}

// Pre-generate static params for SSG
export async function generateStaticParams() {
  try {
    const res = await api.get("/products/list");
    const products: { slug: string }[] = res.data.products || [];
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  if (!slug || slug.toLowerCase() === "favicon.ico") {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  let product: Product | null = null;

  try {
    const res = await api.get(`/products/slug/${encodeURIComponent(slug)}`);
    product = res.data.data;
  } catch(err) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  // build counts and percentages from reviews
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as { [k in 1 | 2 | 3 | 4 | 5]: number };
  let avgRating = 0;

  if (product.reviews && product.reviews.length > 0) {
    product.reviews.forEach(r => {
      const rStar = Math.round(r.rating);
      if (rStar >= 1 && rStar <= 5) {
        ratingCounts[rStar as 1 | 2 | 3 | 4 | 5]++;
      }
      avgRating += r.rating;
    });
    avgRating = avgRating / product.reviews.length;
  } else {
    avgRating = product.rating || 0;
  }

  // convert counts to percentages for bar width
  const totalReviews = product.reviews?.length || 0;
  const ratingPercentages: { [k: number]: number } = {};
  [5, 4, 3, 2, 1].forEach(s => {
    ratingPercentages[s] = totalReviews
      ? Math.round((ratingCounts[s as 1 | 2 | 3 | 4 | 5] / totalReviews) * 100)
      : 0;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:underline text-gray-500">Home</Link> /{" "}
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start">
        <div className="md:w-1/2">
          <ProductGallery
            mainImage={product.images?.[0]?.url || "/placeholder.png"}
            gallery={product.gallery || []}
          />
        </div>
        <div className="md:w-1/2 flex flex-col gap-1 mb-1 md:pl-8">
          {/* Responsive title */}
          <h1 className="text-2xl sm:text-3xl font-bold mt-4 md:mt-0">
            {product.name}
          </h1>

          {product.rating && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-yellow-500">{"★".repeat(Math.floor(product.rating))}</p>
              <span className="text-gray-400 text-sm">
                ({product.reviews?.length || 0} ratings)
              </span>
            </div>
          )}

          {/* Responsive price */}
          {/* Discounted Price Display */}
          <div className="flex flex-col gap-2">
            {/* Discounted Price */}
            <span className="text-xl font-bold text-orange-600">
              Rs. {product.discountedPrice?.toLocaleString()}/-
            </span>

            {/* Original Price + Discount Percentage (only if discount exists) */}
            {product.discountPercentage ? (
              <span className="text-lg flex items-center space-x-2">
                <span className="text-gray-400 line-through">
                  Rs. {product.price?.toLocaleString()}
                </span>
                <span className="text-red-600 font-semibold">
                  -{product.discountPercentage}%
                </span>
              </span>
            ) : null}
          </div>



          
          {/* Product description with CSS-based show more/less */}
          <div className="mt-3">
            <div className="text-gray-700 relative">
              <input type="checkbox" id="description-toggle" className="hidden peer" />
              <div className="peer-checked:line-clamp-none line-clamp-3">
                {product.description}
              </div>
              <label 
                htmlFor="description-toggle" 
                className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-1 cursor-pointer block peer-checked:hidden"
              >
                Show more
              </label>
              <label 
                htmlFor="description-toggle" 
                className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-1 cursor-pointer hidden peer-checked:block"
              >
                Show less
              </label>
            </div>
          </div>
          
          <ProductActions product={product} />
        </div>
      </div>

      <div className="mt-12">
        {/* Product description section with show more/less */}
        <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4">Product Description</h2>
        <div className="text-gray-700 mb-6 relative">
          <input type="checkbox" id="full-description-toggle" className="hidden peer" />
          <div className="peer-checked:line-clamp-none line-clamp-4">
            {product.description}
          </div>
          <label 
            htmlFor="full-description-toggle" 
            className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-2 cursor-pointer block peer-checked:hidden"
          >
            Show more
          </label>
          <label 
            htmlFor="full-description-toggle" 
            className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-2 cursor-pointer hidden peer-checked:block"
          >
            Show less
          </label>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-2">Key Features</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          {product.keyFeatures?.map((f, i) => (
            <li key={i}>{typeof f === "string" ? f : f.label}</li>
          ))}
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-2">Technical Specifications</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          {product.technicalSpecifications?.map((spec, i) => (
            <li key={i}>
              {typeof spec === "string" ? spec : `${spec.label}: ${spec.value}`}
            </li>
          ))}
        </ul>

        <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-2">What's in the Box?</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          {product.boxContents?.map((item, i) => (
            <li key={i}>{typeof item === "string" ? item : item.label}</li>
          ))}
        </ul>
        
        {/* <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-2">Customer Reviews</h2>
        {totalReviews > 0 && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-3xl sm:text-4xl font-bold">{avgRating.toFixed(1)}</div>
              <div>
                <StarRating rating={avgRating} size="lg" />
                <p className="text-gray-600 text-sm">
                  {totalReviews} reviews
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-4 text-sm">{stars}</span>
                  <div className="w-40 sm:w-64 h-2 bg-gray-200 rounded relative">
                    <div
                      className="absolute top-0 left-0 h-2 bg-black rounded"
                      style={{ width: `${ratingPercentages[stars]}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm text-gray-500">
                    {ratingPercentages[stars]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Review list */}
        {/* {product.reviews?.length ? (
          <ul className="space-y-6">
            {product.reviews.map((rev, i) => (
              <ReviewCard key={i} rev={{
                ...rev,
                likes: rev.likes ?? 0,
                dislikes: rev.dislikes ?? 0,
                userVote: rev.userVote ?? "none",
              }} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )} */}

        {/* <ReviewForm productId={product._id} productSlug={product.slug} /> */}
      </div>
    </div>
  );
}