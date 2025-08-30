"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";

const testimonials = [
  {
    id: "1",
    name: "Emily Harper",
    date: "2023-08-15",
    image: "/1.png",
    rating: 5,
    text: "I love the quality and variety of the products. The delivery was fast and the packaging was great.",
    likes: 5,
    dislikes: 2,
  },
  {
    id: "2",
    name: "David Mitchell",
    date: "2023-08-15",
    image: "/2.png",
    rating: 5,
    text: "The products are great and fit well. I would recommend this store to my friends.",
    likes: 7,
    dislikes: 2,
  },
  {
    id: "3",
    name: "Sarah Reynolds",
    date: "2023-08-15",
    image: "/3.png",
    rating: 5,
    text: "The customer service is excellent. I had an issue with my order and it was resolved quickly.",
    likes: 4,
    dislikes: 1,
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-[#F4EFEA] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Customer Testimonials
          </h2>
        </div>

        <div className="flex flex-col gap-10">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TestimonialCard({ t }: { t: any }) {
  const [likes, setLikes] = useState(t.likes);
  const [dislikes, setDislikes] = useState(t.dislikes);
  const [vote, setVote] = useState<"none" | "like" | "dislike">("none");

  const handleLike = () => {
    if (vote === "like") {
      setVote("none");
      setLikes((c:number) => c - 1);
    } else {
      if (vote === "dislike") setDislikes((c: number) => c - 1);
      setVote("like");
      setLikes((c: number) => c + 1);
    }
  };

  const handleDislike = () => {
    if (vote === "dislike") {
      setVote("none");
      setDislikes((c: number) => c - 1);
    } else {
      if (vote === "like") setLikes((c:number) => c - 1);
      setVote("dislike");
      setDislikes((c: number) => c + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* avatar + name + date */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={t.image}
            alt={t.name}
            width={40}
            height={50}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{t.name}</p>
          <p className="text-sm text-gray-500">{t.date}</p>
        </div>
      </div>

      {/* stars */}
      <div className="flex items-center">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 text-orange-500 fill-current"
            strokeWidth={0}
          />
        ))}
      </div>

      {/* text */}
      <p className="text-gray-700">{t.text}</p>

      {/* likes/dislikes */}
      <div className="flex gap-6 mt-1 text-gray-600">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-sm hover:text-green-600 transition"
        >
          <ThumbsUp
            size={16}
            className={vote === "like" ? "text-green-600" : ""}
          />
          {likes}
        </button>
        <button
          onClick={handleDislike}
          className="flex items-center gap-1 text-sm hover:text-red-600 transition"
        >
          <ThumbsDown
            size={16}
            className={vote === "dislike" ? "text-red-600" : ""}
          />
          {dislikes}
        </button>
      </div>
    </div>
  );
}
