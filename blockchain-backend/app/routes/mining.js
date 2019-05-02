const express = require('express');
const globals = require('../../globals');
const Block = require('../classes/Block');
const Miner = require('../classes/Miner');
const Transaction = require('../classes/Transaction');

let app = express.Router();
let chain =  globals.node.getChain();
let candidateBlock = undefined;

// endpoints here!
app.get('/get-mining-job/:minerAddress', (req, res) => {

    let currBlockIndex = chain.blocks.length;
    let coinbaseTx     = Transaction.createCoinbaseTx();
    let pendingTxs     = chain.pendingTransactions;
    let difficulty     = chain.currentDifficulty;
    let prevBlockHash  = chain.getLatestBlock().blockHash;
    let minerAddress   = req.params.minerAddress;

    candidateBlock = new Block(currBlockIndex, [coinbaseTx, pendingTxs],
                               difficulty, prevBlockHash, minerAddress);

    let miner = new Miner(minerAddress, difficulty);

    chain.addMiningJob(candidateBlock.blockDataHash, currBlockIndex);
    miner.mineBlock(candidateBlock);

    res.json(candidateBlock);
});

app.get('/submit-mined-block', (req, res) => {
    chain.addBlock(candidateBlock);

    res.json({'msg': 'submit-mined-block'});
});

module.exports = app;