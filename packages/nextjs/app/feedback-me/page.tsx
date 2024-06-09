"use client";

import React from "react";
import MyFeedback from "./_components/FeedbackForm";
import { FeedbackProvider } from "~~/components/feedback/FeedbackContext";

const App: React.FC = () => {
  return (
    <FeedbackProvider>
      <div className="app">
        <MyFeedback />
      </div>
    </FeedbackProvider>
  );
};

export default App;
