const express = require('express');
const validate = require('../../middlewares/validate');
const transactionValidation = require('../../validations/transaction.validation');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();

router
  .route('/buy/:bookId')
  .post(validate(transactionValidation.buyBook), transactionController.buyBook);

router
  .route('/rent/:bookId')
  .post(validate(transactionValidation.rentBook), transactionController.rentBook);

router
  .route('/my')
  .get(transactionController.getUserTransactions);

module.exports = router; 