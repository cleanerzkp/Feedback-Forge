"use client";

import React from "react";
import { useWriteContract } from "wagmi";
import { useFeedback } from "~~/components/feedback/FeedbackContext";
import DeployedContracts from "~~/contracts/deployedContracts";
import { useTransactor } from "~~/hooks/scaffold-eth";

const GiveFeedback: React.FC = () => {
  const { user, setUser, rating, setRating, comment, setComment } = useFeedback();

  const { writeContractAsync, isPending } = useWriteContract();

  const writeContractAsyncWithParams = () =>
    writeContractAsync({
      address: DeployedContracts[31337].FeedbackForge.address,
      abi: DeployedContracts[31337].FeedbackForge.abi,
      functionName: "provideFeedback",
      args: [user, rating, comment],
    });

  const writeTx = useTransactor();

  const handleProvideFeedback = async () => {
    try {
      await writeTx(writeContractAsyncWithParams, { blockConfirmations: 1 });
      setRating(0);
      setComment("");
    } catch (e) {
      console.log("Unexpected error in writeTx", e);
    }
  };

  return (
    <div className="give-feedback">
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
      <button onClick={handleProvideFeedback} disabled={isPending}>
        {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Submit Feedback"}
      </button>
    </div>
  );
};

export default GiveFeedback;
