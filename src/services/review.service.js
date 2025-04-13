const httpStatus = require('http-status');
const { Review } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
  // Check if user has already reviewed this book
  const existingReview = await Review.findOne({
    book: reviewBody.book,
    user: reviewBody.user,
  });

  if (existingReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already reviewed this book');
  }

  return Review.create(reviewBody);
};

/**
 * Get reviews by book id
 * @param {ObjectId} bookId
 * @returns {Promise<Review[]>}
 */
const getBookReviews = async (bookId) => {
  return Review.find({ book: bookId }).populate('user', 'name email');
};

/**
 * Delete review
 * @param {ObjectId} reviewId
 * @param {ObjectId} userId
 * @returns {Promise<Review>}
 */
const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.remove();
  return review;
};

module.exports = {
  createReview,
  getBookReviews,
  deleteReview,
}; 