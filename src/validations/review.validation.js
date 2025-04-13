const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    book: Joi.string().custom(objectId).required(),
    user: Joi.string().custom(objectId).required(),
    review: Joi.string().required().max(100), // Approximately 25 words
  }),
};

const getBookReviews = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
  }),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createReview,
  getBookReviews,
  deleteReview,
}; 