"use client";

import React from "react";
import GiveFeedback from "./_components/FeedbackForm";
import { FeedbackProvider } from "~~/components/feedback/FeedbackContext";

const GiveFeedbackPage: React.FC = () => {
  return (
    <FeedbackProvider>
      <div className="app">
        <GiveFeedback />
      </div>
    </FeedbackProvider>
  );
};

export default GiveFeedbackPage;
