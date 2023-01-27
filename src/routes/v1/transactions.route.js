const express = require('express');
const validate = require('../../middlewares/validate');
const transactionValidation = require('../../validations/transaction.validation');
const transactionController = require('../../controllers/transaction.controller');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router
    .route('/pay')
    .post(auth(), validate(transactionValidation.makePayments), transactionController.initializeTransaction);

router
    .route('/verify')
    .post(auth(), validate(transactionValidation.verifyPayment), transactionController.verifyPayment);

router
    .route('/all')
    .get(auth(), transactionController.getAllTransactionsForUser)

module.exports = router;