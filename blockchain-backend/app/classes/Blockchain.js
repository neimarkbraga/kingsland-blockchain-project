const Block = require("./Block");
const Transaction = require('./Transaction');
const config = require('../../config');
const utils = require('../libraries/utils');

module.exports = class BlockChain {

    constructor() {
        this.blocks = [BlockChain.createGenesisBlock()];
        this.pendingTransactions = [];
        this.currentDifficulty = 0;
        this.miningJobs = [] //map <blockDataHash -> block>
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

    createPendingTransaction(data) {
        if(!utils.isValidAddress(data.from)) throw new Error(`Invalid from address: ${data.from}`);
        if(!utils.isValidAddress(data.to)) throw new Error(`Invalid to address: ${data.to}`);
        if(typeof data.value !== 'number') throw new Error(`Invalid value: ${data.value}`);
        if(typeof data.fee !== 'number') throw new Error(`Invalid fee: ${data.fee}`);
        if(!utils.isISO8601Date(data.dateCreated)) throw new Error(`Invalid dateCreated ${data.dateCreated}`);
        if(!utils.isValidPublicKey(data.senderPubKey)) throw new Error(`Invalid senderPubKey ${data.senderPubKey}`);
        if(utils.publicKeyToAddress(data.senderPubKey) !== data.from) throw new Error(`Wrong senderPubKey ${data.senderPubKey}`);
        if(!Array.isArray(data.senderSignature)) throw new Error(`Invalid senderSignature format: ${data.senderSignature}`);

        let transaction = new Transaction(
            data.from,
            data.to,
            data.value,
            data.fee,
            data.dateCreated,
            data.data,
            data.senderPubKey,
            undefined,
            data.senderSignature,
            undefined,
            undefined
        );

        // validate balance

        // check signature if valid
        if(!transaction.isValidSignature()) throw new Error('Invalid senderSignature');

        // check duplicate
        if(this.getTransactionByDataHash(transaction.transactionDataHash)) throw new Error('Transaction duplicate detected.');

        this.pendingTransactions.push(transaction);
        return transaction;
    }

    getTransactionByDataHash(hash) {
        for(let i = 0; i < this.blocks.length; i++) {
            let block = this.blocks[i];
            for(let j = 0; j < block.transactions.length; j++) {
                let transaction = block.transactions[j];
                if(transaction.transactionDataHash === hash) return transaction;
            }
        }
        for(let i = 0; i < this.pendingTransactions.length; i++) {
            let transaction = this.pendingTransactions[i];
            if(transaction.transactionDataHash === hash) return transaction;
        }
        return undefined;
    }



    getBlockByIndex(index) {
        return this.blocks[index];
    }

    getBlocks() {
        return this.blocks;
    }
};