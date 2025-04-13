const Joi = require('joi');
const { objectId } = require('./custom.validation');

const buyBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const rentBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    duration: Joi.number().integer().min(1).required(),
  }),
};

const getUserTransactions = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  buyBook,
  rentBook,
  getUserTransactions,
}; 