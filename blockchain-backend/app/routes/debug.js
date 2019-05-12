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

    res.status(200);
    res.json({
        msg: "The chain was reset to its Genesis Block"
    });

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

app.get('/mine/:minerAddress/:difficulty', async (req, res) => {
    try {
        if(!utils.isValidAddress(req.params.minerAddress)) throw new Error('Invalid miner address');
        if(!/^\d+$/.test(req.params.difficulty)) throw new Error('Invalid difficulty');

        let minerAddress = req.params.minerAddress;
        let difficulty = parseInt(req.params.difficulty);
        let candidateBlock = globals.node.chain.createCandidateBlock(minerAddress);
        let miner = new Miner(minerAddress, difficulty);
        miner.mineBlock(candidateBlock);
        await globals.node.chain.addBlock(candidateBlock);
        await globals.node.notifyNewBlock(candidateBlock);
        res.json(candidateBlock);
    }
    catch (error) {
        res.status(400);
        res.json({
            errorMsg: error.message || 'Something went wrong'
        });
    }
});

module.exports = app;