// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract FeedbackForge {
    struct Feedback {
        uint8 rating;
        string comment;
        address feedbackProvider;
        uint256 timestamp;
    }

    // Mapping to store feedbacks for each user
    mapping(address => Feedback[]) private feedbacks;

    // Mapping to store aggregate ratings
    mapping(address => uint256) private ratingSum;
    mapping(address => uint256) private ratingCount;

    // Event to emit when feedback is provided
    event FeedbackProvided(
        address indexed user,
        uint8 rating,
        string comment,
        address indexed feedbackProvider,
        uint256 timestamp
    );

    // Function to provide feedback
    function provideFeedback(address user, uint8 rating, string memory comment) public {
        require(user != address(0), "Invalid user address");
        require(rating >= 0 && rating <= 5, "Rating must be between 0 and 5");

        feedbacks[user].push(Feedback({
            rating: rating,
            comment: comment,
            feedbackProvider: msg.sender,
            timestamp: block.timestamp
        }));
        ratingSum[user] += rating;
        ratingCount[user] += 1;

        emit FeedbackProvided(user, rating, comment, msg.sender, block.timestamp);
    }

    // Function to get feedback count for a user
    function getFeedbackCount(address user) public view returns (uint256) {
        require(user != address(0), "Invalid user address");
        return feedbacks[user].length;
    }

    // Function to get the first feedback for a user
    function getFirstFeedback(address user) public view returns (uint8 rating, string memory comment, address feedbackProvider, uint256 timestamp) {
        require(user != address(0), "Invalid user address");
        require(feedbacks[user].length > 0, "No feedback available");

        Feedback memory fb = feedbacks[user][0];
        return (fb.rating, fb.comment, fb.feedbackProvider, fb.timestamp);
    }

    // Function to get the latest feedback for a user
    function getLatestFeedback(address user) public view returns (uint8 rating, string memory comment, address feedbackProvider, uint256 timestamp) {
        require(user != address(0), "Invalid user address");
        uint256 feedbackCount = feedbacks[user].length;
        require(feedbackCount > 0, "No feedback available");

        Feedback memory fb = feedbacks[user][feedbackCount - 1];
        return (fb.rating, fb.comment, fb.feedbackProvider, fb.timestamp);
    }

    // Function to get feedback by index for a user
    function getFeedback(address user, uint256 index) public view returns (uint8 rating, string memory comment, address feedbackProvider, uint256 timestamp) {
        require(user != address(0), "Invalid user address");
        require(index < feedbacks[user].length, "Index out of bounds");

        Feedback memory fb = feedbacks[user][index];
        return (fb.rating, fb.comment, fb.feedbackProvider, fb.timestamp);
    }

    // Function to get average rating for a user
    function getAverageRating(address user) public view returns (uint256) {
        require(user != address(0), "Invalid user address");

        if (ratingCount[user] == 0) {
            return 0;
        }
        return ratingSum[user] * 100 / ratingCount[user];
    }

    // Function to get all feedback for a user
    function getAllFeedback(address user) public view returns (Feedback[] memory) {
        require(user != address(0), "Invalid user address");
        return feedbacks[user];
    }
}
