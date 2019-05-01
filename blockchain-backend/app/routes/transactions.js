const express = require('express');
const globals = require('../../globals');

let app = express.Router();

// endpoints here!
app.get('/confirmed', (req, res) => {
    res.json(globals.node.chain.getConfirmedTransactions());
});

app.get('/pending', (req, res) => {
    res.json(globals.node.chain.pendingTransactions);
});

app.get('/:hash', (req, res) => {
    let hash = req.params.hash;
    let transaction = globals.node.chain.getTransactionByDataHash(hash);
    if(transaction) res.json(transaction);
    else {
        res.status(404);
        res.json({
            errorMsg: 'Invalid transaction hash'
        });
    }
});

app.post('/send', async(req, res) => {
    try {
        let body = req.body;
        let transaction = globals.node.chain.createPendingTransaction(body);
        globals.node.broadcastPendingTransaction(transaction);
        res.json(transaction);
    }
    catch (error) {
        res.status(400);
        res.json({
            errorMsg: error.message || 'Something went wrong'
        })
    }
});

module.exports = app;