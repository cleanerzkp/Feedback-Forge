"use client";

import React, { useState } from "react";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const MyFeedback: React.FC = () => {
  const [user, setUser] = useState("");
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

  const { data: feedbackEvents } = useScaffoldEventHistory({
    contractName: "FeedbackForge",
    eventName: "FeedbackProvided",
    watch: true,
    fromBlock: 0n,
  });

  return (
    <div className="my-feedback">
      <h2>My Feedback</h2>
      <input type="text" placeholder="User Address" value={user} onChange={e => setUser(e.target.value)} />
      <button onClick={() => setUser(user)}>View My Feedback</button>

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

export default MyFeedback;
