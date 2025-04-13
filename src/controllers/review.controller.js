const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.body);
  res.status(httpStatus.CREATED).send(review);
});

const getBookReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.getBookReviews(req.params.bookId);
  res.send(reviews);
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.reviewId, req.body.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReview,
  getBookReviews,
  deleteReview,
}; 