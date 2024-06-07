"use client";

import React from "react";
import FeedbackLeaderboard from "./_components/FeedbackLeaderboard";

const LeaderboardPage: React.FC = () => {
  return (
    <div className="leaderboard">
      <h1 className="text-4xl font-bold mb-4">Feedback Leaderboard</h1>
      <FeedbackLeaderboard />
    </div>
  );
};

export default LeaderboardPage;
