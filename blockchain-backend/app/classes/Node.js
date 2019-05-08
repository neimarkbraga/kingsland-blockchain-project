const axios = require('axios');
const config = require('../../config');
const utils = require('../libraries/utils');
const BlockChain = require('./Blockchain');
const Block = require('./Block');
const Transaction = require('./Transaction');

module.exports = class Node {

    constructor(options) {
        options = options || {};
        this.nodeId     = utils.sha256(new Date().getTime() + Math.random());
        this.protocol   = options.protocol || 'http';
        this.host       = options.host || '127.0.0.1';
        this.port       = options.port || 5555;
        this.selfUrl    = options.selfUrl || this.getUrl();
        this.peers      = {};
        this.chain      = new BlockChain();
        this.chainId    = this.getChainId();
    }

    broadcastPendingTransaction(transaction) {
        for(let id in this.peers) {
            let peerUrl = this.peers[id];
            try { axios.post(`${peerUrl}/transactions/send`, transaction); }
            catch (error) {  }
        }
    }

    async notifyNewBlock(newBlock) {
        for(let id in this.peers) {
            let peerUrl = this.peers[id];
            let data = this.getInfo();
            data.newBlock = newBlock;
            try { await axios.post(`${peerUrl}/peers/notify-new-block`, data); }
            catch (error) { delete this.peers[id]; }
        }
        return true;
    }

    getChain() {
        return this.chain;
    }

    resetChain() {
        this.chain = new BlockChain();
    }

    getInfo() {
        return {
            about: 'kingsland-blockchain-project',
            nodeId: this.nodeId,
            chainId: this.chain.blocks[0].blockHash,
            nodeUrl: this.selfUrl,
            peers: Object.keys(this.peers).length,
            currentDifficulty: this.chain.currentDifficulty,
            blocksCount: this.chain.blocks.length,
            cumulativeDifficulty: this.chain.getCumulativeDifficulty(),
            confirmedTransactions: this.chain.getConfirmedTransactions().length,
            pendingTransactions: this.chain.pendingTransactions.length,
            averageBlockTime: this.chain.getAverageBlockTime()
        };
    }

    getUrl() {
        let url = `${this.protocol}://${this.host}`;
        if(this.port !== undefined) url += `:${this.port}`;
        return url;
    }

    getChainId() {
        return this.chain.blocks[0].blockHash;
    }

    validatePeerJsonBlocks(blocks) {
        let error = (msg) => { throw new Error(`Invalid Peer BlockChain: ${msg}`); };
        let confirmedTransactions = {};
        let confirmedBalances = {};
        let validatedBlocks = [];

        // for dynamic difficulty
        let difficulty = config.start_difficulty;
        let totalBlockTime = 0;
        let blockTimeCount = 0;

        // Validate the genesis block → should be exactly the same
        if(JSON.stringify(BlockChain.createGenesisBlock()) !== JSON.stringify(Block.createFromJson(blocks[0]))) error('Genesis block did not match');

        // Validate each block from the first to the last
        for(let i = 0; i < blocks.length; i++) {
            let prevBlock = blocks[i - 1];
            let block = blocks[i] = Block.createFromJson(blocks[i]);
            let minerMaxReward = config.block_reward;
            let minerReward = 0;
            let isGenesisBlock = block.index === 0;


            // Validate that all block fields are present and have valid values
            if(typeof block.index !== 'number') error(`Invalid block[${i}].index value`);
            if(!Array.isArray(block.transactions)) error(`Invalid block[${i}].transactions value`);
            if(typeof block.difficulty !== 'number') error(`Invalid block[${i}].difficulty value`);
            if(typeof block.minedBy !== 'string') error(`Invalid block[${i}].minedBy value`);
            if(typeof block.blockDataHash !== 'string') error(`Invalid block[${i}].blockDataHash value`);
            if(typeof block.nonce !== 'number') error(`Invalid block[${i}].nonce value`);
            if(!utils.isISO8601Date(block.dateCreated)) error(`Invalid block[${i}].dateCreated value`);
            if(typeof block.blockHash !== 'string') error(`Invalid block[${i}].blockHash value`);


            // Validate the transactions in the block
            for(let j = 0; j < block.transactions.length; j++) {
                let transaction = block.transactions[j];
                let isRewardTx = false;


                // Validate transaction fields and their values, recalculate the transaction data hash, validate the signature
                if(typeof transaction.from !== 'string') error(`Invalid block[${i}].transaction[${j}].from value`);
                if(typeof transaction.to !== 'string') error(`Invalid block[${i}].transaction[${j}].to value`);
                if(typeof transaction.value !== 'number') error(`Invalid block[${i}].transaction[${j}].value value`);
                if(typeof transaction.fee !== 'number') error(`Invalid block[${i}].transaction[${j}].fee value`);
                if(!utils.isISO8601Date(transaction.dateCreated)) error(`Invalid block[${i}].transaction[${j}].dateCreated value`);
                if(typeof transaction.senderPubKey !== 'string') error(`Invalid block[${i}].transaction[${j}].senderPubKey value`);
                if(!Array.isArray(transaction.senderSignature) && transaction.senderSignature.length !== 2) error(`Invalid block[${i}].transaction[${j}].senderSignature value`);
                if(transaction.transactionDataHash !== transaction.getDataHash()) error(`Invalid block[${i}].transaction[${j}].transactionDataHash calculation`);

                if(!isGenesisBlock) {
                    // calculate miner current and max reward for the block
                    minerMaxReward += transaction.fee;
                    if(transaction.from === config.default_address && transaction.to === block.minedBy) {
                        minerReward += transaction.value;
                        isRewardTx = true;
                    }
                    else if(!transaction.isValidSignature()) error(`Invalid block[${i}].transaction[${j}].senderSignatures`);
                }

                // Re-execute all transactions, re-calculate the values of minedInBlockIndex and transferSuccessful fields
                confirmedBalances[transaction.from] = confirmedBalances[transaction.from] || 0;
                confirmedBalances[transaction.to] = confirmedBalances[transaction.to] || 0;

                if(!isGenesisBlock && !isRewardTx && confirmedBalances[transaction.from] < transaction.fee) error(`Invalid block[${i}].transaction[${j}] - not enough balance`);
                confirmedBalances[transaction.from] -= transaction.fee;

                transaction.minedInBlockIndex = block.index;
                if(!isGenesisBlock && !isRewardTx && confirmedBalances[transaction.from] < transaction.value) transaction.transferSuccessful = false;
                else {
                    confirmedBalances[transaction.from] -= transaction.value;
                    confirmedBalances[transaction.to] += transaction.value;
                    transaction.transferSuccessful = true;
                }

                if(confirmedTransactions[transaction.transactionDataHash]) error(`Invalid block[${i}].transaction[${j}] - duplicate`);
                confirmedTransactions[transaction.transactionDataHash] = transaction;
            }
            if(minerReward > minerMaxReward) error(`Invalid block[${i}] miner reward`);


            // Re-calculate the block data hash and block hash for each block
            block.calculateDataHash();
            block.calculateHash();


            // Ensure the block hash matches the block difficulty
            if(!block.isValidHashDifficulty()) error(`Invalid block[${i}].blockHash difficulty`);

            // Validate that prevBlockHash == the hash of the previous block
            if(!isGenesisBlock && block.prevBlockHash !== prevBlock.blockHash) error(`block[${i}].prevBlockHash did not match`);

            // Validate Difficulty
            if(!isGenesisBlock && difficulty !== block.difficulty) error(`block[${i}].difficulty is not valid`);

            // Dynamic Difficulty
            if(typeof config.target_block_time === 'number' && i > 1) {
                totalBlockTime += utils.getISODatesSecondsDifference(prevBlock.dateCreated, block.dateCreated);
                blockTimeCount++;
                let averageBlockTime = totalBlockTime / blockTimeCount;
                if(averageBlockTime < 5) difficulty++;
                if(averageBlockTime > 5) difficulty--;
                if(difficulty < 0) difficulty = 0;
            }

            // add to validated blocks
            validatedBlocks.push(block);
        }

        return validatedBlocks;
    }

    async syncPeerByInfo(peerInfo) {
        let myInfo = this.getInfo();

        // sync blocks
        if(peerInfo.cumulativeDifficulty > myInfo.cumulativeDifficulty) {
            let peerBlocks = (await axios.get(`${peerInfo.nodeUrl}/blocks`)).data;

            // Re-calculate the cumulative difficulty of the incoming chain
            // If the cumulative difficulty > current cumulative difficulty
            // Replace the current chain with the incoming chain
            // Clear all current mining jobs (because they are invalid)
            this.chain.blocks = this.validatePeerJsonBlocks(peerBlocks);
            this.chain.miningJobs = {};
        }

        // sync pending transactions
        if(peerInfo.pendingTransactions) {
            let pendingTransactions = (await axios.get(`${peerInfo.nodeUrl}/transactions/pending`)).data;
            for(let i = 0; i < pendingTransactions.length; i++) {
                let pendingTransaction = pendingTransactions[i];
                try { this.chain.createPendingTransaction(pendingTransaction) } catch (error) {}
            }
        }

        // resolve promise
        return true;
    }

    async addPeerByUrl(url) {
        let myInfo = this.getInfo();
        let response = await axios.get(`${url}/info`);
        let data = response.data;
        if(data.chainId !== myInfo.chainId) throw new Error('Chain ID did not match.');
        if(data.nodeId === myInfo.nodeId) throw new Error('Cannot connect to self.');
        if(this.peers[data.nodeId]) throw new Error(`Already connected to peer: ${url}`);

        // eliminate url duplication
        for(let id in this.peers) if(this.peers[id] === url) delete this.peers[id];

        // add to peers
        this.peers[data.nodeId] = url;

        // connect back
        try { await axios.post(`${url}/peers/connect`, {peerUrl: this.selfUrl}); } catch (error) {}

        // resolve promise
        return data;
    }
};