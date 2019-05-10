const express = require('express');
const globals = require('../../globals');
const utils = require('../libraries/utils');
const path = require('path');
let app = express.Router();

// endpoints here!
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.get('/test', async (req, res) => {
    res.json('Hello World!');
});

app.get('/info', async (req, res) => {
    res.json(globals.node.getInfo(req));
});

app.get('/search', async (req, res) => {
    let query = req.query;
    let keyword = query.keyword || '';


    // search address
    let balance = globals.node.chain.getAddressBalance(keyword);
    if(balance.safeBalance || balance.confirmedBalance || balance.pendingBalance) {
        res.json({
            type: 'address',
            data: {
                address: keyword,
                balance
            }
        });
        return;
    }


    // search transaction
    let transaction = globals.node.chain.getTransactionByDataHash(keyword);
    if(transaction) {
        res.json({
            type: 'transaction',
            data: transaction
        });
        return;
    }


    // search block
    let block = globals.node.chain.getBlockByHash(keyword);
    if(block) {
        res.json({
            type: 'block',
            data: block
        });
        return;
    }


    // send empty
    res.json({
        type: null,
        data: null
    });
});

module.exports = app;