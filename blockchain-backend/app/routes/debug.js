const express = require('express');
const globals = require('../../globals');

let app = express.Router();

// endpoints here!
app.get("/reset-chain", (req, res) => {

    globals.node.resetChain();

    //TODO: Check If All Transactions and balances will be lost (except Genesis Transactions)
    //TODO: Peers maintains connections

    res.status(200);
    res.json({"msg": "The chain was reset to its Genesis Block"});

});

module.exports = app;