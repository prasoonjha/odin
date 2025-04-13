const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');

const buyBook = catchAsync(async (req, res) => {
  const transaction = await transactionService.buyBook(req.body.userId, req.params.bookId);
  res.status(httpStatus.CREATED).send(transaction);
});

const rentBook = catchAsync(async (req, res) => {
  const transaction = await transactionService.rentBook(
    req.body.userId, 
    req.params.bookId, 
    req.body.duration
  );
  res.status(httpStatus.CREATED).send(transaction);
});

const getUserTransactions = catchAsync(async (req, res) => {
  const transactions = await transactionService.getUserTransactions(req.query.userId);
  res.send(transactions);
});

module.exports = {
  buyBook,
  rentBook,
  getUserTransactions,
}; 