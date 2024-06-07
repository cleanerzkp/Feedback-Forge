"use client";

import type { NextPage } from "next";
import { ChartBarIcon, LightBulbIcon, StarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Feedback Forge v0.1</h1>
        <p className="text-xl mb-6">
          A decentralized platform designed to enhance and manage feedback within community-driven projects.
        </p>
        <div className="flex justify-center items-center space-x-2 mb-6">
          <p className="my-2 font-medium">FeedbackForge Address:</p>
          <Address address="0xd905Fe646A553a1F81DF0fc12fC9D988e3aFeAA8" />
        </div>
        <div className="bg-base-100 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex flex-col items-center max-w-xs">
              <StarIcon className="h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-2">Feedback System</h3>
              <p className="text-center">
                Provide feedback using a 0-5 star rating system with optional comments.{" "}
                <strong>Giving feedback is super cheap!</strong>
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs">
              <UsersIcon className="h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-2">Community Insights</h3>
              <p className="text-center">
                View community member activities and contributions.{" "}
                <strong>Seeing feedback you receive is free.</strong>
              </p>
            </div>
            <div className="flex flex-col items-center max-w-xs">
              <ChartBarIcon className="h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-2">Gamification</h3>
              <p className="text-center">Soon: Earn tokens and NFTs for your feedback activity.</p>
            </div>
            <div className="flex flex-col items-center max-w-xs">
              <LightBulbIcon className="h-12 w-12 text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-2">Future Plans</h3>
              <p className="text-center">Innovative verification methods and gasless solutions.</p>
            </div>
          </div>
        </div>
        <p className="text-lg mt-8 max-w-2xl mx-auto">
          Feedback Forge aims to promote transparency and continuous improvement through blockchain technology,
          fostering innovation in decentralized feedback mechanisms. We welcome your support and feedback as we evolve.{" "}
          <strong>All transactions are on the Base chain.</strong>
        </p>
      </div>
    </div>
  );
};

export default Home;
