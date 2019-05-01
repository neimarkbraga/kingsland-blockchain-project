const express = require('express');
const globals = require('../../globals');

let app = express.Router();

// endpoints here!

let blocks = globals.node.getChain().getBlocks();
app.get('/confirmed', (req, res) => {
    res.status(200);

    blocks.forEach((block) => {
        res.json(block.getConfirmedTransactions()) // 1 block for now
    });



});

app.get('/pending', (req, res) => {
    res.status(200);
    res.json(globals.node.chain.pendingTransactions);
});

app.post('/send', async(req, res) => {
    try {
        let body = req.body;
        let transaction = globals.node.chain.createPendingTransaction(body);

        // broadcast transaction

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