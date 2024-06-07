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

  const { data: getAllFeedback } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getAllFeedback",
    args: [undefined], // or args: [] as const
  });

  useEffect(() => {
    const fetchFeedbackEntries = async () => {
      if (getAllFeedback) {
        const entries: FeedbackEntry[] = await Promise.all(
          getAllFeedback.map(async feedback => {
            const { rating, feedbackProvider, timestamp } = feedback;
            return {
              address: feedbackProvider,
              rating,
              timestamp: Number(timestamp.toString()),
            };
          }),
        );
        setFeedbackEntries(entries);
      }
    };

    fetchFeedbackEntries();
  }, [getAllFeedback]);

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
