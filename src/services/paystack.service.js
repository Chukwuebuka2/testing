const axios = require('axios');
const httpStatus = require('http-status');
const transactionService = require('./transaction.service');
const { secret } = require('../config/config').paystack;
const ApiError = require('../utils/ApiError');
const { getUserByEmail, getUserById } = require('./user.service');

const apiCall = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: { authorization: `Bearer ${secret}` }
});

/**
 * verify payment transaction
 * @param {ObjectId} reference 
 * @returns { Promise <paymentStatus> }
 */
const verifyPayment = async (reference) => {
    try {
        const res = await apiCall.get(`transaction/verify/${reference}`);
        const {
            data: { id, status, gateway_response },
        } = res.data;

        const response = { id, status, gateway_response };
        return response;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error)
    }
}

const initializeTransaction = async (userId, details) => {
    //  we need to check if the user is that is initiating the payment is the right user with the right email
    const email = await getUserByEmail(details.email);
    const user = await getUserById(userId);

    if (!email || !user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect details provided");
    }

    if (await email.dataValues.email != user.dataValues.email) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect details provided")
    }

    const payload = {
        ...details,
        amount: details.amount * 100
    };

    const amount = payload.amount;

    try {
        const res = await apiCall.post('/transaction/initialize', payload);
        const {
            status,
            data: { authorization_url, access_code, reference },
        } = res.data;

        // every transaction will be saved to the transaction database
        const transactionBody = { userId, amount, reference, access_code, status };
        await transactionService.createTransaction(transactionBody)


        return authorization_url;
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, error);
    }
}



module.exports = {
    verifyPayment,
    initializeTransaction
}