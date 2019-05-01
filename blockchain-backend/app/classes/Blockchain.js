const Block = require("./Block");
const Miner = require("./Miner");
const Transaction = require('./Transaction');
const config = require('../../config');

module.exports = class BlockChain {

    constructor() {
        this.blocks = [BlockChain.createGenesisBlock()];
        this.pendingTransactions = [];
        this.currentDifficulty = 0;
        this.miningJobs = new Map; //map <blockDataHash -> block>
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

    sendMiningJob(minerAddress) {
        if (!this.pendingTransactions) {
            return;
        }

        let candidateBlock = new Block(
                                        this.blocks.length + 1,   // index
                                        this.pendingTransactions, // transactions
                                        this.currentDifficulty,   // difficulty
                                        "prevBlockHash",          // prevBlockHash
                                        0,                        // minedBy
                                        "blockDataHash",          // blockDataHash
                                        0,                        // nonce
                                        new Date(),               // dateCreated
                                        undefined                 // blockHash
                                      );

        let miner = new Miner(
                                minerAddress,
                                this.currentDifficulty,
                                candidateBlock.getDataHash(),
                             );

        // ADD TO MINING JOBS
        // this.miningJobs.set(this.candidateBlock.getDataHash(), this.blocks.length + 1);
    }

    getBlockByIndex(index) {
        return this.blocks[index];
    }

    getBlocks() {
        return this.blocks;
    }
};