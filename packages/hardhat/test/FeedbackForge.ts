import { expect } from "chai";
import { ethers } from "hardhat";
import { FeedbackForge } from "../typechain-types";

describe("FeedbackForge", function () {
  let feedbackForge: FeedbackForge;
  let user1: any;
  let user2: any;

  before(async () => {
    [, user1, user2] = await ethers.getSigners();
    const feedbackForgeFactory = await ethers.getContractFactory("FeedbackForge");
    feedbackForge = (await feedbackForgeFactory.deploy()) as FeedbackForge;
    await feedbackForge.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy the contract successfully", async function () {
      const address = await feedbackForge.getAddress();
      expect(address).to.properAddress;
    });
  });

  describe("Providing Feedback", function () {
    it("Should allow a user to provide feedback", async function () {
      const rating = 4;
      const comment = "Great job!";
      await expect(feedbackForge.connect(user1).provideFeedback(user2.address, rating, comment))
        .to.emit(feedbackForge, "FeedbackProvided")
        .withArgs(user2.address, rating, comment, user1.address);

      const feedbackCount = await feedbackForge.getFeedbackCount(user2.address);
      expect(feedbackCount).to.equal(1);
    });

    it("Should store the feedback correctly", async function () {
      const feedback = await feedbackForge.getFeedback(user2.address, 0);
      expect(feedback.rating).to.equal(4);
      expect(feedback.comment).to.equal("Great job!");
      expect(feedback.feedbackProvider).to.equal(user1.address);
    });
  });

  describe("Retrieving Feedback", function () {
    before(async function () {
      await feedbackForge.connect(user1).provideFeedback(user2.address, 5, "Excellent work!");
    });

    it("Should return the correct feedback count", async function () {
      const feedbackCount = await feedbackForge.getFeedbackCount(user2.address);
      expect(feedbackCount).to.equal(2);
    });

    it("Should return the first feedback correctly", async function () {
      const firstFeedback = await feedbackForge.getFirstFeedback(user2.address);
      expect(firstFeedback.rating).to.equal(4);
      expect(firstFeedback.comment).to.equal("Great job!");
      expect(firstFeedback.feedbackProvider).to.equal(user1.address);
    });

    it("Should return the latest feedback correctly", async function () {
      const latestFeedback = await feedbackForge.getLatestFeedback(user2.address);
      expect(latestFeedback.rating).to.equal(5);
      expect(latestFeedback.comment).to.equal("Excellent work!");
      expect(latestFeedback.feedbackProvider).to.equal(user1.address);
    });

    it("Should return the correct feedback by index", async function () {
      const feedback = await feedbackForge.getFeedback(user2.address, 1);
      expect(feedback.rating).to.equal(5);
      expect(feedback.comment).to.equal("Excellent work!");
      expect(feedback.feedbackProvider).to.equal(user1.address);
    });

    it("Should return the correct average rating", async function () {
      const averageRating = await feedbackForge.getAverageRating(user2.address);
      expect(averageRating).to.equal(450); // (4 + 5) * 100 / 2
    });

    it("Should return all feedbacks correctly", async function () {
      const allFeedback = await feedbackForge.getAllFeedback(user2.address);
      expect(allFeedback.length).to.equal(2);
      expect(allFeedback[0].rating).to.equal(4);
      expect(allFeedback[1].rating).to.equal(5);
    });
  });

  describe("Edge Cases", function () {
    it("Should revert if trying to provide feedback to zero address", async function () {
      await expect(
        feedbackForge.connect(user1).provideFeedback(ethers.ZeroAddress, 3, "Invalid user"),
      ).to.be.revertedWith("Invalid user address");
    });

    it("Should revert if trying to provide feedback with an invalid rating", async function () {
      await expect(feedbackForge.connect(user1).provideFeedback(user2.address, 6, "Invalid rating")).to.be.revertedWith(
        "Rating must be between 0 and 5",
      );
    });

    it("Should revert if trying to get feedback count for zero address", async function () {
      await expect(feedbackForge.getFeedbackCount(ethers.ZeroAddress)).to.be.revertedWith("Invalid user address");
    });

    it("Should revert if trying to get first feedback for zero address", async function () {
      await expect(feedbackForge.getFirstFeedback(ethers.ZeroAddress)).to.be.revertedWith("Invalid user address");
    });

    it("Should revert if trying to get latest feedback for zero address", async function () {
      await expect(feedbackForge.getLatestFeedback(ethers.ZeroAddress)).to.be.revertedWith("Invalid user address");
    });

    it("Should revert if trying to get feedback by invalid index", async function () {
      await expect(feedbackForge.getFeedback(user2.address, 10)).to.be.revertedWith("Index out of bounds");
    });

    it("Should return zero average rating if no feedbacks are available", async function () {
      const averageRating = await feedbackForge.getAverageRating(user1.address);
      expect(averageRating).to.equal(0);
    });
  });
});
