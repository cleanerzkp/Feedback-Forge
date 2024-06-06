import FeedbackForm from "./_components/FeedbackForm";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Give Feedback",
  description: "Provide feedback for users on the FeedbackForge contract",
});

const GiveFeedbackPage: NextPage = () => {
  return (
    <>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Give Feedback</h1>
        <p className="text-neutral">Provide feedback for users on the FeedbackForge contract here.</p>
        <FeedbackForm />
      </div>
    </>
  );
};

export default GiveFeedbackPage;
