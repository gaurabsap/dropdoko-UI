export default function LoadingProduct() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-32 bg-gray-200 mb-6 rounded"></div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Gallery skeleton */}
        <div className="md:w-1/2">
          {/* Large image */}
          <div className="h-96 w-full bg-gray-200 rounded mb-4"></div>
          {/* Thumbnail row */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="md:w-1/2 space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-20 w-full bg-gray-200 rounded"></div>

          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Details skeleton */}
      <div className="mt-12 space-y-6">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-24 w-full bg-gray-200 rounded"></div>

        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <ul className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="h-4 w-2/3 bg-gray-200 rounded"></li>
          ))}
        </ul>

        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <ul className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="h-4 w-2/3 bg-gray-200 rounded"></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
