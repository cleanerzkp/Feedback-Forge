"use client";

import React, { useEffect, useState } from "react";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface FeedbackEntry {
  address: string;
  rating: number;
  timestamp: number;
}

interface FeedbackLeaderboardProps {
  sortBy: "rating" | "address" | "date";
  sortOrder: "asc" | "desc";
}

const FeedbackLeaderboard: React.FC<FeedbackLeaderboardProps> = ({ sortBy, sortOrder }) => {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);

  const { data: getAllFeedback, error } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getAllFeedback",
    args: [undefined], // Ensure the correct arguments are passed
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching feedback data:", error);
      return;
    }
    if (getAllFeedback) {
      console.log("Feedback data retrieved:", getAllFeedback); // Log retrieved data for debugging
      const entries = getAllFeedback.map((feedback: any) => ({
        address: feedback.feedbackProvider,
        rating: feedback.rating,
        timestamp: Number(feedback.timestamp),
      }));
      setFeedbackEntries(entries.slice(0, 10)); // Display the latest 10 feedback entries initially
    }
  }, [getAllFeedback, error]);

  const sortFeedbackEntries = (entries: FeedbackEntry[]) => {
    return entries.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "rating") {
        comparison = a.rating - b.rating;
      } else if (sortBy === "address") {
        comparison = a.address.localeCompare(b.address);
      } else if (sortBy === "date") {
        comparison = a.timestamp - b.timestamp;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  const sortedFeedbackEntries = sortFeedbackEntries(feedbackEntries);

  return (
    <div className="feedback-leaderboard">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Address</th>
            <th>Rating</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {sortedFeedbackEntries.map((entry, index) => (
            <tr key={`${entry.address}-${entry.timestamp}`}>
              <th>{index + 1}</th>
              <td>
                <Address address={entry.address} format="short" />
              </td>
              <td>{entry.rating}</td>
              <td>{new Date(entry.timestamp * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackLeaderboard;
