const express = require('express');
const globals = require('../../globals');
const utils = require('../libraries/utils');

let app = express.Router();

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

app.post('/submit-mined-block', async (req, res) => {
    try {
        let body = req.body;
        if(!body.blockDataHash) throw new Error('blockDataHash field is missing.');
        if(!body.dateCreated) throw new Error('dateCreated field is missing.');
        if(body.nonce === undefined) throw new Error('nonce field is missing.');
        if(!body.blockHash) throw new Error('blockHash field is missing.');
        if(!utils.isISO8601Date(body.dateCreated)) throw new Error('invalid dateCreated format.');
        body.nonce = Number(body.nonce);

        let candidate = globals.node.chain.miningJobs[body.blockDataHash];
        if(!candidate) throw new Error('Block not found or already mined');

        candidate.nonce = body.nonce;
        candidate.dateCreated = body.dateCreated;
        candidate.calculateHash();
        globals.node.chain.addBlock(candidate);
        await globals.node.notifyNewBlock(candidate, req.headers.host);

        res.json({
            message: `Block accepted, reward paid: ${candidate.transactions[0].value} microcoins`
        });
    }
    catch (error) {
        res.status(400);
        res.json({
            errorMsg: error.message || 'Something went wrong'
        });
    }
});

module.exports = app;