"use client";

import React, { useState } from "react";
import FeedbackLeaderboard from "./_components/FeedbackLeaderboard";

const LeaderboardPage = () => {
  const [sortBy, setSortBy] = useState<"rating" | "address" | "date">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const [newSortBy, newSortOrder] = value.split("-") as ["rating" | "address" | "date", "asc" | "desc"];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="leaderboard">
      <h1 className="text-4xl font-bold mb-4">Feedback Leaderboard</h1>
      <div className="sort-controls mb-4">
        <label htmlFor="sort-select" className="mr-2">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={`${sortBy}-${sortOrder}`}
          onChange={handleSortChange}
          className="select select-sm"
        >
          <option value="rating-desc">Rating (descending)</option>
          <option value="rating-asc">Rating (ascending)</option>
          <option value="address-asc">Wallet Address (ascending)</option>
          <option value="address-desc">Wallet Address (descending)</option>
          <option value="date-asc">Date (ascending)</option>
          <option value="date-desc">Date (descending)</option>
        </select>
      </div>
      <FeedbackLeaderboard sortBy={sortBy} sortOrder={sortOrder} />
    </div>
  );
};

export default LeaderboardPage;
