const httpStatus = require('http-status');
const logger = require('../config/logger');
const { db } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById, getUserByEmail } = require('./user.service');

// get all transactions
const getAllTransactionsForUser = async (userId) => {
    const user = getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }
    return await db.transactions.findAll({
        where: {
            userId: userId
        }
    })
}

// create transactions
const createTransaction = async (transactionBody) => {
    return await db.transactions.create(transactionBody);
}

// get transaction by reference
const getTransactionByReference = async (reference) => {
    const transaction = await db.transactions.findOne({
        where: {
            reference
        }
    });
    return transaction;
};

// update a transaction in the transaction table
const updateTransaction = async (reference, transactionBody) => {
    const transaction = await getTransactionByReference(reference);

    if (!transaction) {
        throw new ApiError(httpStatus.NOT_FOUND, "Transaction not found");
    }
    return await db.transactions.update(transactionBody, {
        where: {
            reference: reference
        }
    });
};


module.exports = {
    getAllTransactionsForUser,
    createTransaction,
    getTransactionByReference,
    updateTransaction
}