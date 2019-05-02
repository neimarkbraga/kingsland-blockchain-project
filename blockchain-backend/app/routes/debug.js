const express = require('express');
const globals = require('../../globals');
const utils = require('../libraries/utils');
const config = require('../../config');

const Block = require('./../classes/Block');
const Miner = require('./../classes/Miner');
const Transaction = require('./../classes/Transaction');

let app = express.Router();

// endpoints here!
app.get('/', (req, res) => {
    res.json({
        node: globals.node,
        confirmedBalances: globals.node.chain.getConfirmedBalances()
    });
});

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
    let chain =  globals.node.getChain();

    let currBlockIndex = chain.blocks.length;
    let coinbaseTx     = Transaction.createCoinbaseTx();
    let pendingTxs     = chain.pendingTransactions;
    let difficulty     = req.params.difficulty;
    let prevBlockHash  = chain.getLatestBlock().blockHash;
    let minerAddress   = req.params.minerAddress;

    let candidateBlock = new Block(currBlockIndex, [coinbaseTx, pendingTxs],
                                   difficulty, prevBlockHash, minerAddress);

    let miner = new Miner(minerAddress, difficulty);

    miner.mineBlock(candidateBlock);
    res.json(candidateBlock);
});

module.exports = app;