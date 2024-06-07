"use client";

import React, { useEffect, useState } from "react";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface FeedbackEntry {
  rating: number;
  comment: string;
  feedbackProvider: string;
  timestamp: number;
}

interface UserFeedback {
  feedbackCount: number;
  averageRating: number;
  firstFeedback: FeedbackEntry | null;
  latestFeedback: FeedbackEntry | null;
  allFeedback: FeedbackEntry[];
}

const FeedbackLeaderboard: React.FC = () => {
  const [user, setUser] = useState("");
  const [userFeedback, setUserFeedback] = useState<UserFeedback | null>(null);
  const [latestFeedbacks, setLatestFeedbacks] = useState<FeedbackEntry[]>([]);

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

  const { data: firstFeedback } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getFirstFeedback",
    args: [user],
  });

  const { data: latestFeedback } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getLatestFeedback",
    args: [user],
  });

  const { data: allFeedback } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getAllFeedback",
    args: [user],
  });

  // Fetching the latest 10 feedbacks on component mount
  const { data: initialFeedbacks, error: initialError } = useScaffoldReadContract({
    contractName: "FeedbackForge",
    functionName: "getAllFeedback",
    args: [undefined],
  });

  useEffect(() => {
    if (initialError) {
      console.error("Error fetching initial feedback data:", initialError);
      return;
    }
    if (initialFeedbacks) {
      const entries = initialFeedbacks.slice(-10).map((feedback: any) => ({
        rating: feedback.rating,
        comment: feedback.comment,
        feedbackProvider: feedback.feedbackProvider,
        timestamp: feedback.timestamp,
      }));
      setLatestFeedbacks(entries); // Display the latest 10 feedback entries
    }
  }, [initialFeedbacks, initialError]);

  useEffect(() => {
    if (feedbackCount && averageRating && firstFeedback && latestFeedback && allFeedback) {
      setUserFeedback({
        feedbackCount: Number(feedbackCount),
        averageRating: Number(averageRating) / 100, // Assuming the average rating is multiplied by 100 in the contract
        firstFeedback: firstFeedback
          ? {
              rating: firstFeedback[0],
              comment: firstFeedback[1],
              feedbackProvider: firstFeedback[2],
              timestamp: Number(firstFeedback[3]),
            }
          : null,
        latestFeedback: latestFeedback
          ? {
              rating: latestFeedback[0],
              comment: latestFeedback[1],
              feedbackProvider: latestFeedback[2],
              timestamp: Number(latestFeedback[3]),
            }
          : null,
        allFeedback: allFeedback.map((feedback: any) => ({
          rating: feedback.rating,
          comment: feedback.comment,
          feedbackProvider: feedback.feedbackProvider,
          timestamp: feedback.timestamp,
        })),
      });
    }
  }, [feedbackCount, averageRating, firstFeedback, latestFeedback, allFeedback]);

  const { data: feedbackEvents } = useScaffoldEventHistory({
    contractName: "FeedbackForge",
    eventName: "FeedbackProvided",
    fromBlock: 0n,
    watch: true,
  });

  return (
    <div className="feedback-leaderboard">
      <div className="input-group mb-4">
        <input
          type="text"
          className="input input-bordered"
          placeholder="Enter user address"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setUser(user)}>
          Fetch Feedback
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Latest Feedbacks</h2>
      <ul>
        {latestFeedbacks.map((feedback, index) => (
          <li key={index}>
            <p>
              <strong>Rating:</strong> {feedback.rating}
            </p>
            <p>
              <strong>Comment:</strong> {feedback.comment}
            </p>
            <p>
              <strong>Feedback Provider:</strong> {feedback.feedbackProvider}
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date(feedback.timestamp * 1000).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {userFeedback && (
        <div className="feedback-details">
          <h2>User Feedback Details</h2>
          <p>
            <strong>Feedback Count:</strong> {userFeedback.feedbackCount}
          </p>
          <p>
            <strong>Average Rating:</strong> {userFeedback.averageRating}
          </p>
          {userFeedback.firstFeedback && (
            <div>
              <h3>First Feedback</h3>
              <p>
                <strong>Rating:</strong> {userFeedback.firstFeedback.rating}
              </p>
              <p>
                <strong>Comment:</strong> {userFeedback.firstFeedback.comment}
              </p>
              <p>
                <strong>Feedback Provider:</strong> {userFeedback.firstFeedback.feedbackProvider}
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date(userFeedback.firstFeedback.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          )}
          {userFeedback.latestFeedback && (
            <div>
              <h3>Latest Feedback</h3>
              <p>
                <strong>Rating:</strong> {userFeedback.latestFeedback.rating}
              </p>
              <p>
                <strong>Comment:</strong> {userFeedback.latestFeedback.comment}
              </p>
              <p>
                <strong>Feedback Provider:</strong> {userFeedback.latestFeedback.feedbackProvider}
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date(userFeedback.latestFeedback.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          )}
          <h3>All Feedback</h3>
          <ul>
            {userFeedback.allFeedback.map((feedback, index) => (
              <li key={index}>
                <p>
                  <strong>Rating:</strong> {feedback.rating}
                </p>
                <p>
                  <strong>Comment:</strong> {feedback.comment}
                </p>
                <p>
                  <strong>Feedback Provider:</strong> {feedback.feedbackProvider}
                </p>
                <p>
                  <strong>Timestamp:</strong> {new Date(feedback.timestamp * 1000).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Recent Feedback Events</h2>
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

export default FeedbackLeaderboard;
