const Block = require("./Block");
const Transaction = require('./Transaction');
const config = require('../../config');

module.exports = class BlockChain {

    constructor() {
        this.genesisBlock = BlockChain.createGenesisBlock();
        this.blocks = [this.genesisBlock];
        this.pendingTransactions = [];
        this.currentDifficulty = 0;
        this.miningJobs = [] //map
    }

    static createGenesisBlock() {
        let transactions = [new Transaction(
            config.default_address,             // from
            config.faucet_address,              // to
            config.faucet_init_value,           // value
            0,                                  // fee
            config.genesis_date,                // dateCreated
            'genesis tx',                       // data
            config.default_public_key,          // senderPubKey
            undefined,                          // transactionDataHash
            config.default_sender_signature,    // senderSignature
            0,                                  // minedInBlockIndex
            true                                // transferSuccessful
        )];

        return new Block(
            0,                      // index
            transactions,           // transactions
            0,                      // difficulty
            undefined,              // prevBlockHash
            config.default_address, // minedBy
            undefined,              // blockDataHash
            0,                      // nonce
            config.genesis_date,    // dateCreated
            undefined               // blockHash
        );
    }

    resetChain() {
        this.blocks = [this.genesisBlock];
    }


    getBlockByIndex(index) {
        return this.blocks[index];
    }

    getBlocks() {
        return this.blocks;
    }
};