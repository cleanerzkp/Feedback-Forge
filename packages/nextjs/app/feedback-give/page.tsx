"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const GiveFeedbackPage: NextPage = () => {
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: feedbackCount } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getFeedbackCount",
    args: [user],
  });

  const { data: averageRating } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getAverageRating",
    args: [user],
  });

  const { writeContractAsync: provideFeedback } = useScaffoldWriteContract("FeedbackForge");

  const handleProvideFeedback = async () => {
    try {
      await provideFeedback({
        functionName: "provideFeedback",
        args: [user, rating, comment],
      });
      setRating(0);
      setComment("");
    } catch (e) {
      console.error("Error providing feedback:", e);
    }
  };

  const { data: feedbackEvents } = useScaffoldEventHistory({
    contractName: "FeedbackForge",
    eventName: "FeedbackProvided",
    watch: true,
    fromBlock: 0n,
  });

  return (
    <div className="text-center mt-8 p-10">
      <h1 className="text-4xl my-0">Give Feedback</h1>
      <p className="text-neutral">Provide feedback for users on the FeedbackForge contract here.</p>
      <div className="feedback-component">
        <h2>Provide Feedback</h2>
        <input
          type="text"
          placeholder="User Address"
          value={user}
          onChange={e => setUser(e.target.value)}
          className="w-full p-3 mb-4 border border-base-300 rounded-lg"
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          min="0"
          max="5"
          className="w-full p-3 mb-4 border border-base-300 rounded-lg"
        />
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full p-3 mb-4 border border-base-300 rounded-lg"
        ></textarea>
        <button onClick={handleProvideFeedback} className="btn btn-primary w-full">
          Submit Feedback
        </button>

        <h2>User Feedback</h2>
        <p>Feedback Count: {feedbackCount}</p>
        <p>Average Rating: {averageRating}</p>

        <h2>Recent Feedback Events</h2>
        <ul className="list-disc pl-5">
          {feedbackEvents?.map((event, index) => (
            <li key={index} className="mb-2">
              {event.args.feedbackProvider} gave a rating of {event.args.rating} with comment &quot;{event.args.comment}
              &quot; on {new Date(Number(event.args.timestamp ?? 0n) * 1000).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GiveFeedbackPage;
