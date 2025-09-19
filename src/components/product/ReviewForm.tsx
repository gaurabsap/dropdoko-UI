/* eslint-disable */

'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '@/components/context/userContext';
import api from '@/tools/axiosClient';

interface ReviewFormProps {
  productId: string;
  productSlug: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, productSlug }) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // block if not logged in
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (rating === 0) return;
    setIsSubmitting(true);
    setError('');

    try {
      // you already have `api` instance
      const response = await api.post(`/review/create/${productSlug}`, {
        rating,
        comment,
        productId,
      });

      if (response.status === 200 || response.status === 201) {
        setSubmissionSuccess(true);
        setRating(0);
        setComment('');
        // refresh page or trigger re-fetch
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } catch (err: any) {
      setError('An error occurred while submitting your review.');
      console.error('Review submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
        <p>Thank you for your review! It will be displayed after approval.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">Your Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                <span className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <span className="text-gray-600 text-sm">{rating}/5</span>
        </div>

        {/* Comment */}
        <div className="flex flex-col gap-1">
          <label htmlFor="comment" className="text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
