"use client";

import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { Address, AddressInput, InputBase, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Feedback {
  rating: number;
  comment: string;
  feedbackProvider: string;
  timestamp: bigint;
}

interface FeedbackContextType {
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  feedbackCount?: number;
  averageRating?: number;
  feedbackData: Feedback[];
  feedbackEvents: any[];
  provideFeedback: (user: string, rating: number, comment: string) => Promise<void>;
  loadFeedbackData: () => void;
  loading: boolean;
  error?: string;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [feedbackEvents, setFeedbackEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { data: feedbackCountBigInt } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getFeedbackCount",
    args: [user],
  });

  const feedbackCount = feedbackCountBigInt ? Number(feedbackCountBigInt) : undefined;

  const { data: averageRatingBigInt } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getAverageRating",
    args: [user],
  });

  const averageRating = averageRatingBigInt ? Number(averageRatingBigInt) : undefined;

  const { writeContractAsync: provideFeedbackContract } = useScaffoldWriteContract("FeedbackForge");

  const provideFeedback = async (user: string, rating: number, comment: string) => {
    setLoading(true);
    setError(undefined);
    try {
      await provideFeedbackContract({
        functionName: "provideFeedback",
        args: [user, rating, comment],
      });
      setRating(0);
      setComment("");
      loadFeedbackData();
    } catch (e) {
      console.error("Error providing feedback:", e);
      setError("Failed to provide feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { data: feedbackEventsData } = useScaffoldEventHistory({
    contractName: "FeedbackForge",
    eventName: "FeedbackProvided",
    watch: true,
    fromBlock: 0n,
  });

  const { data: allFeedback } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getAllFeedback",
    args: [user],
  });

  const loadFeedbackData = useCallback(() => {
    if (allFeedback) {
      setFeedbackData([...allFeedback]);
    }
  }, [allFeedback]);

  useEffect(() => {
    loadFeedbackData();
    if (feedbackEventsData) {
      setFeedbackEvents([...feedbackEventsData]);
    }
  }, [allFeedback, feedbackEventsData, loadFeedbackData]);

  return (
    <FeedbackContext.Provider
      value={{
        user,
        setUser,
        rating,
        setRating,
        comment,
        setComment,
        feedbackCount,
        averageRating,
        feedbackData,
        feedbackEvents,
        provideFeedback,
        loadFeedbackData,
        loading,
        error,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};

// Example Component Using the Context
const FeedbackComponent: React.FC = () => {
  const {
    user,
    setUser,
    rating,
    setRating,
    comment,
    setComment,
    feedbackCount,
    averageRating,
    feedbackData,
    provideFeedback,
    loading,
    error,
  } = useFeedback();

  const handleRatingChange = (newRating: string | bigint) => {
    setRating(typeof newRating === "bigint" ? Number(newRating) : parseInt(newRating));
  };

  const handleProvideFeedback = () => {
    if (user && rating >= 0 && rating <= 5 && comment) {
      provideFeedback(user, rating, comment);
    } else {
      alert("Please provide a valid user address, rating (0-5), and comment.");
    }
  };

  return (
    <div>
      <h1>Feedback Forge</h1>
      <AddressInput value={user} onChange={setUser} placeholder="Input user address" />
      <IntegerInput value={rating.toString()} onChange={handleRatingChange} placeholder="Rating (0-5)" />
      <InputBase value={comment} onChange={setComment} placeholder="Comment" />

      <button onClick={handleProvideFeedback} disabled={loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {feedbackCount !== undefined && <p>Total Feedbacks: {feedbackCount}</p>}
      {averageRating !== undefined && <p>Average Rating: {averageRating / 100}</p>}

      <div>
        <h2>Feedback List</h2>
        {feedbackData.length > 0 ? (
          feedbackData.map((feedback, index) => (
            <div key={index}>
              <p>Rating: {feedback.rating}</p>
              <p>Comment: {feedback.comment}</p>
              <Address address={feedback.feedbackProvider} format="short" />
              <p>Timestamp: {new Date(Number(feedback.timestamp) * 1000).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No feedback available.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackComponent;
