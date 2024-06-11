"use client";

import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { useFeedback } from "~~/components/feedback/FeedbackContext";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import Slider from "~~/components/slider/Slider";

const GiveFeedback: React.FC = () => {
  const { user, setUser, rating, setRating, comment, setComment, provideFeedback, loadFeedbackData, feedbackData } =
    useFeedback();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeedbackData();
  }, [loadFeedbackData]);

  const handleProvideFeedback = async () => {
    if (!user) {
      setError("Please enter your address.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await provideFeedback(user, rating, comment);
      setRating(0);
      setComment("");
      loadFeedbackData();
    } catch (e) {
      setError("An error occurred while providing feedback.");
    } finally {
      setLoading(false);
    }
  };

  const latestFeedback = feedbackData.length > 0 ? feedbackData[feedbackData.length - 1] : null;

  return (
    <div className="feedback-component max-w-xl mx-auto p-6 bg-base-100 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Provide Feedback</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="w-full mb-4">
          <AddressInput value={user} onChange={setUser} placeholder="Your Address" />
        </div>
        <div className="w-full mb-4">
          <Slider value={rating} onChange={setRating} />
        </div>
        <div className="w-full mb-4">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comment (optional)"
            className="textarea textarea-bordered w-full"
            rows={3}
          />
        </div>
        <button onClick={handleProvideFeedback} disabled={loading} className="btn btn-primary w-full">
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Submit Feedback"}
        </button>
        {error && <p className="text-error mt-4">{error}</p>}
      </div>

      <h2 className="text-2xl font-bold mb-4">Latest Feedback</h2>
      {latestFeedback ? (
        <div className="p-4 bg-base-200 rounded-lg">
          <div className="flex items-center mb-2">
            <p className="mr-2 font-semibold">Rating:</p>
            <div className="rating flex">
              {[...Array(latestFeedback.rating)].map((_, index) => (
                <StarIcon key={index} className="h-6 w-6 text-primary" />
              ))}
            </div>
          </div>
          <p className="mb-2">
            <span className="font-semibold">Comment:</span> {latestFeedback.comment || "No comment provided."}
          </p>
          <div className="flex items-center mb-2">
            <p className="mr-2 font-semibold">Feedback Provider:</p>
            <Address address={latestFeedback.feedbackProvider} format="short" />
          </div>
          <p className="font-semibold">
            Timestamp: {new Date(Number(latestFeedback.timestamp) * 1000).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>No feedback found.</p>
      )}
    </div>
  );
};

export default GiveFeedback;
