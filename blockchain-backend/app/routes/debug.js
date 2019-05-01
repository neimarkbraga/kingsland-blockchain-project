const express = require('express');
const globals = require('../../globals');
const utils = require('../libraries/utils');

const Block = require('./../classes/Block');
const Miner = require('./../classes/Miner');
const Transaction = require('./../classes/Transaction');

let app = express.Router();

// endpoints here!
app.get("/reset-chain", (req, res) => {

    globals.node.resetChain();

    //TODO: Check If All Transactions and balances will be lost (except Genesis Transactions)
    //TODO: Peers maintains connections

    res.status(200);
    res.json({"msg": "The chain was reset to its Genesis Block"});

});

app.get('/random-wallet', (req, res) => {
    let private_key = utils.generatePrivateKey();
    let public_key  = utils.privateKeyToPublicKey(private_key);
    let address = utils.publicKeyToAddress(public_key);
    res.json({
        private_key,
        public_key,
        address
    });
});

app.get('/mine/:minerAddress/:difficulty', (req, res) => {
    let currBlockIndex = globals.node.getChain().blocks.length + 1;
    let latestBlock = globals.node.getChain().getLatestBlock();

    let pendingTxs  = globals.node.getChain().getPendingTransactions()
    console.log(pendingTxs);

    let debugMiner = new Miner(req.params.minerAddress,
                               req.params.difficulty,
                               currBlockIndex,
                               latestBlock.blockHash,
                               pendingTxs);

    res.json(debugMiner.mineBlock())
});

module.exports = app;