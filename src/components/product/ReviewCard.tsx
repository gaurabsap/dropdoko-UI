/* eslint-disable */
"use client";

import { useRef, useState, useEffect } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";
import api from "@/tools/axiosClient";
import { toast } from "react-toastify";
import { useUser } from "@/components/context/userContext";

export interface Review {
  _id?: string;
  user: { _id: string; fullName: string; profile?: string };
  rating: number;
  createdAt: string;
  likes: number;
  dislikes: number;
  review?: string;
  userVote: "like" | "dislike" | "none";
}

interface ReviewCardProps {
  rev: Review;
  refreshReviews?: () => void;
}

export default function ReviewCard({ rev, refreshReviews }: ReviewCardProps) {
  const { user } = useUser();
  const [likes, setLikes] = useState<number>(rev.likes ?? 0);
  const [dislikes, setDislikes] = useState<number>(rev.dislikes ?? 0);
  const [vote, setVote] = useState<"none" | "like" | "dislike">(rev.userVote ?? "none");
  const [loading, setLoading] = useState(false);
  const voteTimeout = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (voteTimeout.current) clearTimeout(voteTimeout.current);
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleVote = (type: "like" | "dislike") => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }

    // Clear previous timeout and API call
    if (voteTimeout.current) clearTimeout(voteTimeout.current);
    abortControllerRef.current?.abort();

    // Store previous state for rollback
    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevVote = vote;

    // Calculate new state based on current vote and new type
    let newLikes = likes;
    let newDislikes = dislikes;
    let newVote: "none" | "like" | "dislike" = type;

    if (vote === type) {
      // Toggle off if clicking the same button again
      newVote = "none";
      if (type === "like") newLikes -= 1;
      else newDislikes -= 1;
    } else {
      // Switching from one vote type to another
      if (type === "like") {
        newLikes += 1;
        if (vote === "dislike") newDislikes -= 1;
      } else {
        newDislikes += 1;
        if (vote === "like") newLikes -= 1;
      }
    }

    // Optimistic update
    setLikes(newLikes);
    setDislikes(newDislikes);
    setVote(newVote);
    setLoading(true);

    // Setup new abort controller
    abortControllerRef.current = new AbortController();

    // Delay API call
    voteTimeout.current = setTimeout(async () => {
      try {
        // Determine the correct endpoint based on the new vote state
        let endpoint = "";
        if (newVote === "like") {
          endpoint = `/review/like/${rev._id}`;
        } else if (newVote === "dislike") {
          endpoint = `/review/dislike/${rev._id}`;
        } else {
          // If toggling off, we need to remove the previous vote
          endpoint = `/review/${prevVote === "like" ? "unlike" : "undislike"}/${rev._id}`;
        }

        const res = await api.post(endpoint, {
          signal: abortControllerRef.current?.signal
        });

        const updated: Review = res.data.data;
        setLikes(updated.likes);
        setDislikes(updated.dislikes);
        setVote(updated.userVote);
        refreshReviews?.();
      } catch (err: any) {
        if (err.name === 'CanceledError') return;
        
        toast.error(err.response?.data?.error || "Failed to vote");
        // Revert optimistic update on error
        setLikes(prevLikes);
        setDislikes(prevDislikes);
        setVote(prevVote);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <li className="flex gap-4 border-b pb-4">
      {/* Avatar */}
      <Image
        src={rev.user?.profile || "/placeholder-avatar.png"}
        alt={rev.user?.fullName}
        className="w-12 h-12 rounded-full object-cover"
        width={48}
        height={48}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{rev.user?.fullName}</p>
            <p className="text-sm text-gray-500">
              {new Date(rev.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center mt-1">
          {Array.from({ length: rev.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 text-orange-500 fill-current" strokeWidth={0} />
          ))}
        </div>

        {/* Review text */}
        {rev.review && <p className="text-gray-700 mt-1">{rev.review}</p>}

        {/* Like/Dislike buttons */}
        <div className="flex gap-6 mt-2 text-gray-600 text-sm">
          <button
            disabled={loading}
            onClick={() => handleVote("like")}
            className={`flex items-center gap-1 transition ${
              vote === "like" ? "text-green-600 font-semibold" : "hover:text-green-600"
            }`}
          >
            <ThumbsUp className="w-4 h-4" /> <span>{likes}</span>
          </button>

          <button
            disabled={loading}
            onClick={() => handleVote("dislike")}
            className={`flex items-center gap-1 transition ${
              vote === "dislike" ? "text-red-600 font-semibold" : "hover:text-red-600"
            }`}
          >
            <ThumbsDown className="w-4 h-4" /> <span>{dislikes}</span>
          </button>
        </div>
      </div>
    </li>
  );
}