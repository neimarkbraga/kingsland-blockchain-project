const express = require('express');
const globals = require('../../globals');
const utils = require('../libraries/utils');
const Block = require('../classes/Block');
const Miner = require('../classes/Miner');
const Transaction = require('../classes/Transaction');

let app = express.Router();
let chain =  globals.node.getChain();
let candidateBlock = undefined;

// endpoints here!
app.get('/get-mining-job/:minerAddress', (req, res) => {
    let address = req.params.minerAddress;
    try {
        if(!utils.isValidAddress(address)) throw new Error('Invalid address');
        let candidateBlock = globals.node.chain.createCandidateBlock(address);
        res.json({
            index: candidateBlock.index,
            transactionsIncluded: candidateBlock.transactions.length,
            difficulty: candidateBlock.difficulty,
            expectedReward: candidateBlock.transactions[0].value,
            rewardAddress: address,
            blockDataHash: candidateBlock.blockDataHash
        });
    }
    catch (error) {
        res.status(400);
        res.json({
            errorMsg: error.message || 'Something went wrong'
        });
    }
});

app.get('/submit-mined-block', (req, res) => {
    chain.addBlock(candidateBlock);

    res.json(chain.blocks);
});

module.exports = app;