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

    blocks.forEach((block) => {
        res.json(block.getPendingTransactions()) // 1 block for now
    });
});

module.exports = app;