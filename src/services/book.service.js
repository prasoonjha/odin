const httpStatus = require('http-status');
const { Book } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a book
 * @param {Object} bookBody
 * @returns {Promise<Book>}
 */
const createBook = async (bookBody) => {
  if (await Book.findOne({ isbn: bookBody.isbn })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'ISBN already exists');
  }
  return Book.create(bookBody);
};

/**
 * Query for books
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Book[]>}
 */
const queryBooks = async (filter) => {
  const books = await Book.find(filter);
  return books;
};

/**
 * Get book by id
 * @param {ObjectId} id
 * @returns {Promise<Book>}
 */
const getBookById = async (id) => {
  return Book.findById(id);
};

/**
 * Update book by id
 * @param {ObjectId} bookId
 * @param {Object} updateBody
 * @returns {Promise<Book>}
 */
const updateBookById = async (bookId, updateBody) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  if (updateBody.isbn && (await Book.findOne({ isbn: updateBody.isbn, _id: { $ne: bookId } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'ISBN already exists');
  }
  Object.assign(book, updateBody);
  await book.save();
  return book;
};

/**
 * Delete book by id
 * @param {ObjectId} bookId
 * @returns {Promise<Book>}
 */
const deleteBookById = async (bookId) => {
  const book = await getBookById(bookId);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  await book.remove();
  return book;
};

module.exports = {
  createBook,
  queryBooks,
  getBookById,
  updateBookById,
  deleteBookById,
}; 