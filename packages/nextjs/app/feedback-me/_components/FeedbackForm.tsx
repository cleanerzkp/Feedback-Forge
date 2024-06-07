"use client";

import React from "react";
import { useFeedback } from "~~/components/feedback/FeedbackContext";

const MyFeedback: React.FC = () => {
  const { user, setUser, feedbackCount, averageRating, feedbackEvents, feedbackData } = useFeedback();

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

      <h2>All Feedback</h2>
      <ul>
        {feedbackData.map((feedback, index) => (
          <li key={index}>
            <p>Rating: {feedback.rating}</p>
            <p>Comment: {feedback.comment}</p>
            <p>Feedback Provider: {feedback.feedbackProvider}</p>
            <p>Timestamp: {new Date(Number(feedback.timestamp) * 1000).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyFeedback;
