const express = require('express');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(reviewValidation.createReview), reviewController.createReview);

router
  .route('/book/:bookId')
  .get(validate(reviewValidation.getBookReviews), reviewController.getBookReviews);

router
  .route('/:reviewId')
  .delete(validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router; 