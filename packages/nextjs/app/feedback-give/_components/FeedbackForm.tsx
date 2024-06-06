"use client";

import React, { useState } from "react";
import { useScaffoldEventHistory, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const FeedbackComponent: React.FC = () => {
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
    <div className="feedback-component">
      <h2>Provide Feedback</h2>
      <input type="text" placeholder="User Address" value={user} onChange={e => setUser(e.target.value)} />
      <input
        type="number"
        placeholder="Rating"
        value={rating}
        onChange={e => setRating(Number(e.target.value))}
        min="0"
        max="5"
      />
      <textarea placeholder="Comment" value={comment} onChange={e => setComment(e.target.value)}></textarea>
      <button onClick={handleProvideFeedback}>Submit Feedback</button>

      <h2>User Feedback</h2>
      <p>Feedback Count: {feedbackCount}</p>
      <p>Average Rating: {averageRating}</p>

      <h2>Recent Feedback Events</h2>
      <ul>
        {feedbackEvents?.map((event, index) => (
          <li key={index}>
            {event.args.feedbackProvider} gave a rating of {event.args.rating} with comment &quot;{event.args.comment}
            &quot; on {new Date(Number(event.args.timestamp ?? 0n) * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackComponent;
