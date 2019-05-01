const Block = require("./Block");
const Miner = require("./Miner");
const Transaction = require('./Transaction');
const config = require('../../config');
const utils = require('../libraries/utils');

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
        let balance = this.getAddressBalance(data.from);
        if(balance.confirmedBalance < (data.value + data.fee)) throw new Error('Sender does not have enough balance.');

        // check signature if valid
        if(!transaction.isValidSignature()) throw new Error('Invalid sender signature.');

        // check duplicate
        if(this.getTransactionByDataHash(transaction.transactionDataHash)) throw new Error('Transaction duplicate detected.');

        this.pendingTransactions.push(transaction);
        return transaction;
    }

    getAddressTransactions(address) {
        let transactions = this.getAllTransactions();
        return transactions.filter(item => {
            return item.to === address || item.from === address;
        });
    }

    getConfirmedTransactions() {
        let transactions = [];
        for(let i = 0; i < this.blocks.length; i++) {
            let block = this.blocks[i];
            for(let j = 0; j < block.transactions.length; j++) {
                transactions.push(block.transactions[j]);
            }
        }
        return transactions;
    }

    getAllTransactions() {
        let transactions = this.getConfirmedTransactions();
        for(let i = 0; i < this.pendingTransactions.length; i++) {
            transactions.push(this.pendingTransactions[i]);
        }
        return transactions;
    }

    getTransactionByDataHash(hash) {
        let transactions = this.getAllTransactions();
        for(let i = 0; i < transactions.length; i++) {
            let transaction = transactions[i];
            if(transaction.transactionDataHash === hash) return transaction;
        }
        return undefined;
    }

    getAllBalances() {
        let balances = {};
        let transactions = this.getAllTransactions();
        for(let i = 0; i < transactions.length; i++) {
            let transaction = transactions[i];
            let confirmations = transaction.getConfirmations(this.blocks.length);

            balances[transaction.from] = balances[transaction.from] || {
                safeBalance: 0,
                confirmedBalance: 0,
                pendingBalance: 0
            };
            balances[transaction.to] = balances[transaction.to] || {
                safeBalance: 0,
                confirmedBalance: 0,
                pendingBalance: 0
            };

            // pending balance
            balances[transaction.from].pendingBalance -= transaction.fee;
            if(transaction.isPending() || transaction.transferSuccessful) {
                balances[transaction.from].pendingBalance -= transaction.value;
                balances[transaction.to].pendingBalance += transaction.value;
            }

            // safe balance
            if(confirmations >= config.safe_confirms) {
                balances[transaction.from].safeBalance -= transaction.fee;
                if(transaction.transferSuccessful) {
                    balances[transaction.from].safeBalance -= transaction.value;
                    balances[transaction.to].safeBalance += transaction.value;
                }
            }

            // confirmed balance
            if(confirmations >= 1) {
                balances[transaction.from].confirmedBalance -= transaction.fee;
                if(transaction.transferSuccessful) {
                    balances[transaction.from].confirmedBalance -= transaction.value;
                    balances[transaction.to].confirmedBalance += transaction.value;
                }
            }
        }
        return balances;
    }

    getAddressBalance(address) {
        let balances = this.getAllBalances();
        return balances[address] || {
            safeBalance: 0,
            confirmedBalance: 0,
            pendingBalance: 0
        };
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