"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
}: {
  images: { url: string }[];
  name: string;
}) {
  const [mainImage, setMainImage] = useState(images[0]?.url);

  return (
    <div className="flex flex-col gap-4">
      <Image
        src={mainImage || "/placeholder.png"}
        alt={name}
        width={100}
        height={100}
        className="rounded-lg w-full h-auto object-cover"
      />
      <div className="flex gap-2">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img.url}
            alt={`${name} thumbnail`}
            width={80}
            height={80}
            className={`rounded-lg border cursor-pointer ${
              img.url === mainImage ? "border-orange-500" : "border-gray-300"
            }`}
            onClick={() => setMainImage(img.url)}
          />
        ))}
      </div>
    </div>
  );
}
