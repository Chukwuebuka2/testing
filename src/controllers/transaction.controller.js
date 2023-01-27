const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { payStackService, transactionService } = require('../services');

const initializeTransaction = catchAsync(async (req, res) => {
    const { body } = req;
    const url = await payStackService.initializeTransaction(req.userId, body);
    res.status(httpStatus.OK).send(url);
});

const verifyPayment = catchAsync(async (req, res) => {
    // first verify if the refernce exist in the database
    try {
        const transaction = await transactionService.getTransactionByReference(req.body.reference);
        if (!transaction.dataValues) {
            throw new ApiError(httpStatus.BAD_REQUEST, "transaction not found");
        }

        // verify on paystack
        const response = await payStackService.verifyPayment(req.body.reference);
        if (response.status === "success") {
            // update the status on the transaction database
            await transactionService.updateTransaction(req.body.reference, { "status": "success" })
            res.status(httpStatus.OK).json("Payment successfull")
        } else {
            // update the status on the transaction database
            await transactionService.updateTransaction(req.body.reference, { "status": "failed" })
            res.json("Payment failed")
        }
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).json(error);
    }
});

const getAllTransactionsForUser = catchAsync(async (req, res) => {
    const transactions = await transactionService.getAllTransactionsForUser(req.userId);
    if (transactions.length === 0) {
        res.json("User has not performed any transactions yet");
        return;
    }
    res.status(httpStatus.OK).json(transactions);
})

module.exports = {
    initializeTransaction,
    verifyPayment,
    getAllTransactionsForUser,
}