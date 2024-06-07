"use client";

import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
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
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [feedbackEvents, setFeedbackEvents] = useState<any[]>([]);

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
