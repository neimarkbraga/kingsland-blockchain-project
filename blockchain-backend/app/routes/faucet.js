const express = require('express');
const axios = require('axios');
const config = require('../../config');
const globals = require('../../globals');
const utils = require('../libraries/utils');
const Transaction = require('../classes/Transaction');
let app = express.Router();


let createGreedWatch = () => {
    let expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return {
        requests: 0,
        expiration: expiration.getTime()
    };
};

// endpoints here!
app.post('/', async (req, res) => {
    try {
        let body = req.body;
        let greedWatch = globals.faucetGreedWatch;

        // validate captcha
        let response = await axios({
            method: 'post',
            url: 'https://www.google.com/recaptcha/api/siteverify',
            params: {
                secret: config.google_recaptcha_secret_key,
                response: body.captcha
            }
        });
        let data = response.data;
        if(!data.success) throw new Error('Invalid captcha');


        // validate address
        if(!utils.isValidAddress(body.address)) throw new Error('Invalid Address');


        // validate if greedy
        greedWatch[body.address] = greedWatch[body.address] || createGreedWatch();
        if(new Date().getTime() >= greedWatch[body.address].expiration) greedWatch[body.address] = createGreedWatch();
        if(greedWatch[body.address].requests >= 1) {
            let minutes_left = greedWatch[body.address].expiration - new Date().getTime();
            minutes_left /= (1000 * 60);
            minutes_left = Math.ceil(minutes_left);
            throw new Error(`Greedy user! Please try again after ${minutes_left} minutes`);
        }


        // create transaction and sign
        let transaction = new Transaction(
            config.faucet_address,
            body.address,
            config.faucet_tx_value,
            config.faucet_tx_fee,
            new Date().toISOString(),
            config.faucet_tx_data,
            config.faucet_public_key,
            undefined,
            undefined,
            undefined,
            undefined
        );
        transaction.sign(config.faucet_private_key);
        globals.node.chain.createPendingTransaction(transaction);
        greedWatch[body.address].requests++;

        res.json({
            message: `${transaction.value} coins was sent to address ${body.address}. transaction hash is ${transaction.transactionDataHash}`,
            tx: transaction.transactionDataHash,
            address: body.address,
            value: transaction.value
        });
    }
    catch(error) {
        res.status(400);
        res.json({
            errorMsg: error.message || 'Something went wrong.'
        });
    }
});

module.exports = app;