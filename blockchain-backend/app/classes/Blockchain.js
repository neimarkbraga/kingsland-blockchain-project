const Block = require("./Block");
const Transaction = require('./Transaction');
const config = require('../../config');
const utils = require('../libraries/utils');

module.exports = class BlockChain {

    constructor() {
        this.blocks = [BlockChain.createGenesisBlock()];
        this.pendingTransactions = [];
        this.currentDifficulty = config.start_difficulty;
        this.miningJobs = {};
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

    removePendingTransactionByHash(hash) {
        for(let i = 0; i < this.pendingTransactions.length; i++) {
            if(this.pendingTransactions[i].transactionDataHash === hash) {
                this.pendingTransactions.splice(i, 1);
                break;
            }
        }
    }

    getCumulativeDifficulty() {
        //Cumulative difficulty == how much effort is spent to calculate it
        //cumulativeDifficulty == 16 ^ d0 + 16 ^ d1 + … 16 ^ dn
        //where d0, d1, … dn are the individual difficulties of the blocks
        let difficulty = 0;
        for(let i = 0; i < this.blocks.length; i++) {
            let block = this.blocks[i];
            difficulty += Math.pow(16, block.difficulty);
        }
        return difficulty;
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

    getConfirmedBalances() {
        let balances = this.getAllBalances();
        for(let address in  balances) balances[address] = balances[address].confirmedBalance;
        return balances;
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

    getLatestBlock() {
        let currIndex = this.blocks.length - 1;
        return this.blocks[currIndex];
    }

    getBlockByIndex(index) {
        return this.blocks[index];
    }

    getBlockByHash(hash) {
        for(let i = 0; i < this.blocks.length; i++) {
            let block = this.blocks[i];
            if(block.blockHash === hash) return block;
        }
        return undefined;
    }

    getBlocks() {
        return this.blocks;
    }

    createCandidateBlock(address) {
        let newBlockIndex = this.blocks.length;
        let lastBlock = this.blocks[newBlockIndex - 1];
        let coinbaseTx = Transaction.createCoinbaseTx(address);
        let pendingTxs = JSON.parse(JSON.stringify(this.pendingTransactions));
        let finalTxs = [coinbaseTx];
        let balances = this.getConfirmedBalances();


        // determine if transfer is successful
        for(let i = 0; i < pendingTxs.length; i++) {
            let pendingTx = pendingTxs[i];

            balances[pendingTx.from] = balances[pendingTx.from] || 0;
            balances[pendingTx.to] = balances[pendingTx.to] || 0;
            if(balances[pendingTx.from] < pendingTx.fee) this.removePendingTransactionByHash(pendingTx.transactionDataHash);
            else {
                pendingTx.minedInBlockIndex = newBlockIndex;
                balances[pendingTx.from] -= pendingTx.fee;
                coinbaseTx.value += pendingTx.fee;

                if(balances[pendingTx.from] < pendingTx.value) pendingTx.transferSuccessful = false;
                else {
                    balances[pendingTx.from] -= pendingTx.value;
                    balances[pendingTx.to] += pendingTx.value;
                    pendingTx.transferSuccessful = true;
                }
                finalTxs.push(Transaction.createFromJson(pendingTx));
            }
        }

        coinbaseTx.minedInBlockIndex = newBlockIndex;
        coinbaseTx.transferSuccessful = true;
        coinbaseTx.calculateDataHash();

        let candidateBlock = new Block(
            newBlockIndex,
            finalTxs,
            this.currentDifficulty,
            lastBlock.blockHash,
            address,
            undefined,
            0,
            new Date().toISOString(),
            undefined
        );
        this.miningJobs[candidateBlock.blockDataHash] = candidateBlock;

        return candidateBlock;
    }

    addBlock(newBlock) {
        let latestBlock = this.getLatestBlock();
        let confirmedBalances = this.getConfirmedBalances();
        let minerMaxReward = config.block_reward;
        let minerReward = 0;

        if(typeof newBlock.index !== 'number') throw new Error('Invalid block index value');
        if(!Array.isArray(newBlock.transactions)) throw new Error('Invalid block transactions value');
        if(typeof newBlock.difficulty !== 'number') throw new Error('Invalid block difficulty value');
        if(typeof newBlock.minedBy !== 'string') throw new Error('Invalid block minedBy value');
        if(typeof newBlock.blockDataHash !== 'string') throw new Error('Invalid block blockDataHash value');
        if(typeof newBlock.nonce !== 'number') throw new Error('Invalid block nonce value');
        if(!utils.isISO8601Date(newBlock.dateCreated)) throw new Error('Invalid block dateCreated value');
        if(typeof newBlock.blockHash !== 'string') throw new Error('Invalid block blockHash value');

        for(let i = 0; i < newBlock.transactions.length; i++) {
            let transaction = newBlock.transactions[i];
            let isRewardTx = false;


            if(typeof transaction.from !== 'string') throw new Error(`Invalid transaction[${i}].from value`);
            if(typeof transaction.to !== 'string') throw new Error(`Invalid transaction[${i}].to value`);
            if(typeof transaction.value !== 'number') throw new Error(`Invalid transaction[${i}].value value`);
            if(typeof transaction.fee !== 'number') throw new Error(`Invalid transaction[${i}].fee value`);
            if(!utils.isISO8601Date(transaction.dateCreated)) throw new Error(`Invalid transaction[${i}].dateCreated value`);
            if(typeof transaction.senderPubKey !== 'string') throw new Error(`Invalid transaction[${i}].senderPubKey value`);
            if(!Array.isArray(transaction.senderSignature) && transaction.senderSignature.length !== 2) throw new Error(`Invalid transaction[${i}].senderSignature value`);
            if(transaction.transactionDataHash !== transaction.getDataHash()) throw new Error(`Invalid transaction[${i}].transactionDataHash calculation`);


            minerMaxReward += transaction.fee;
            if(transaction.from === config.default_address && transaction.to === newBlock.minedBy) {
                minerReward += transaction.value;
                isRewardTx = true;
            }
            else if(!transaction.isValidSignature()) throw new Error(`Invalid transaction[${i}].senderSignatures`);

            confirmedBalances[transaction.from] = confirmedBalances[transaction.from] || 0;
            confirmedBalances[transaction.to] = confirmedBalances[transaction.to] || 0;


            if(!isRewardTx && confirmedBalances[transaction.from] < transaction.fee) throw new Error(`Invalid transaction[${i}] - not enough balance`);
            confirmedBalances[transaction.from] -= transaction.fee;

            transaction.minedInBlockIndex = newBlock.index;
            if(!isRewardTx && confirmedBalances[transaction.from] < transaction.value) transaction.transferSuccessful = false;
            else {
                confirmedBalances[transaction.from] -= transaction.value;
                confirmedBalances[transaction.to] += transaction.value;
                transaction.transferSuccessful = true;
            }

            let _transaction = this.getTransactionByDataHash(transaction.transactionDataHash);
            if(_transaction && _transaction.isConfirmed()) throw new Error(`Invalid transaction[${i}] - duplicate`);
        }
        if(minerReward > minerMaxReward) error(`Invalid block[${i}] miner reward`);

        if(newBlock.index !== this.blocks.length) throw new Error('Block is already in blockchain');
        if(newBlock.prevBlockHash !== latestBlock.blockHash) throw new Error('Invalid prevBlockHash');


        if(newBlock.blockHash !== newBlock.getHash()) throw new Error(`Invalid block blockHash calculation`);
        if(!newBlock.isValidHashDifficulty()) throw new Error('Invalid PoW');

        this.blocks.push(newBlock);
        this.miningJobs = {};
        this.pendingTransactions = [];
    }
};