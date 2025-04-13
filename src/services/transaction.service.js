const httpStatus = require('http-status');
const { Transaction, Book } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Buy a book
 * @param {ObjectId} userId
 * @param {ObjectId} bookId
 * @returns {Promise<Transaction>}
 */
const buyBook = async (userId, bookId) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  
  if (!book.availableForSale || book.quantityAvailable < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book is not available for sale');
  }
  
  // Create transaction
  const transaction = await Transaction.create({
    user: userId,
    book: bookId,
    type: 'buy',
    status: 'completed',
    price: book.price,
  });
  
  // Update book quantity
  book.quantityAvailable -= 1;
  if (book.quantityAvailable === 0) {
    book.availableForSale = false;
    book.availableForRent = false;
  }
  await book.save();
  
  return transaction;
};

/**
 * Rent a book
 * @param {ObjectId} userId
 * @param {ObjectId} bookId
 * @param {Number} duration
 * @returns {Promise<Transaction>}
 */
const rentBook = async (userId, bookId, duration) => {
  if (!duration || duration < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid rental duration');
  }
  
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  
  if (!book.availableForRent || book.quantityAvailable < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book is not available for rent');
  }
  
  // Calculate return date
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + duration);
  
  // Create transaction
  const transaction = await Transaction.create({
    user: userId,
    book: bookId,
    type: 'rent',
    status: 'completed',
    rentalDuration: duration,
    returnDate,
    price: book.rentalPrice * duration,
  });
  
  // Update book quantity
  book.quantityAvailable -= 1;
  if (book.quantityAvailable === 0) {
    book.availableForSale = false;
    book.availableForRent = false;
  }
  await book.save();
  
  return transaction;
};

/**
 * Get user transactions
 * @param {ObjectId} userId
 * @returns {Promise<Transaction[]>}
 */
const getUserTransactions = async (userId) => {
  return Transaction.find({ user: userId }).populate('book');
};

module.exports = {
  buyBook,
  rentBook,
  getUserTransactions,
}; 