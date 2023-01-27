const Joi = require('joi');

const makePayments = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        amount: Joi.number().required()
    })
}

const verifyPayment = {
    body: Joi.object().keys({
        reference: Joi.string().required(),
    })
}

module.exports = {
    makePayments,
    verifyPayment,
}