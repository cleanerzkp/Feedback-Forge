"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useFeedback } from "~~/components/feedback/FeedbackContext";
import { Address, AddressInput } from "~~/components/scaffold-eth";

const MyFeedback: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const { user, setUser, feedbackCount, averageRating, feedbackEvents, feedbackData, loadFeedbackData } = useFeedback();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullComment, setShowFullComment] = useState<{ [key: number]: boolean }>({});

  const handleViewFeedback = async () => {
    if (!user) {
      setError("Please enter a valid address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loadFeedbackData();
      if (feedbackCount === 0) {
        setError(`No feedback available for ${user}`);
      }
    } catch (e) {
      setError("Error loading feedback.");
    }
    setLoading(false);
  };

  const handleShowFullComment = (index: number) => {
    setShowFullComment(prevState => ({ ...prevState, [index]: !prevState[index] }));
  };

  return (
    <div className="feedback-component p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">My Feedback</h2>
      <div className="flex flex-col items-center mb-4">
        <div className="w-full mb-2">
          <AddressInput value={user} onChange={setUser} placeholder="Input user address" />
        </div>
        <button onClick={handleViewFeedback} disabled={loading} className="btn btn-primary w-full sm:w-auto mt-2">
          {loading ? "Loading..." : "View My Feedback"}
        </button>
      </div>

      {!user && <p>Please enter a user address to view feedback.</p>}

      {loading && <p>Loading feedback...</p>}
      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && feedbackCount !== undefined && feedbackCount > 0 && (
        <div className="mb-4">
          <p>Feedback Count: {feedbackCount}</p>
          {averageRating !== undefined && <p>Average Rating: {(averageRating / 100).toFixed(2)}</p>}
        </div>
      )}

      <div className={`transition-opacity duration-500 ${!connectedAddress ? "blur-sm" : "blur-none"}`}>
        <h2 className="text-lg font-semibold mt-6">Recent Feedback Events</h2>
        {!loading && feedbackEvents && feedbackEvents.length > 0 ? (
          <ul className="list-disc pl-5">
            {feedbackEvents.map((event, index) => (
              <li key={index} className="mb-2">
                <div className="flex items-center">
                  <Address address={event.args.feedbackProvider} format="short" />
                  <span className="mx-2">gave feedback to</span>
                  <Address address={event.args.user} format="short" />
                </div>
                <div>
                  <span>
                    Rating: {event.args.rating} with comment &quot;{event.args.comment}&quot; on{" "}
                    {new Date(Number(event.args.timestamp ?? 0n) * 1000).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>No recent feedback events.</p>
        )}

        <h2 className="text-lg font-semibold mt-6">All Feedback</h2>
        {!loading && feedbackData && feedbackData.length > 0 ? (
          <ul className="list-disc pl-5">
            {feedbackData.map((feedback, index) => (
              <li key={index} className="mb-4">
                <p>Rating: {feedback.rating}</p>
                <p>
                  Comment:
                  {showFullComment[index] ? feedback.comment : `${feedback.comment.substring(0, 50)}...`}
                  {feedback.comment.length > 50 && (
                    <button onClick={() => handleShowFullComment(index)} className="text-blue-500 hover:underline ml-2">
                      {showFullComment[index] ? "Show Less" : "Show More"}
                    </button>
                  )}
                </p>
                <p>
                  Feedback Provider: <Address address={feedback.feedbackProvider} format="short" />
                </p>
                <p>Timestamp: {new Date(Number(feedback.timestamp) * 1000).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && !error && <p>No feedback found for {user}.</p>
        )}
      </div>
    </div>
  );
};

export default MyFeedback;
