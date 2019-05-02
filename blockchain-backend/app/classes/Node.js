const axios = require('axios');
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
        // code for broadcasting pending transaction to peers
    }

    getChain() {
        return this.chain;
    }

    getPeers() {
        return 0;
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
            cumulativeDifficulty: this.chain.cumulativeDifficulty(),
            confirmedTransactions: this.chain.getConfirmedTransactions().length,
            pendingTransactions: this.chain.pendingTransactions.length
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
        let confirmedBalances = {};
        let validatedBlocks = [];
        let error = (msg) => { throw new Error(`Invalid Peer BlockChain: ${msg}`); };

        // Validate the genesis block → should be exactly the same
        if(JSON.stringify(this.chain.blocks[0]) !== JSON.stringify(Block.createFromJson(blocks[0]))) error('Genesis block did not match');
        validatedBlocks.push(Block.createFromJson(blocks[0]));

        // Validate each block from the first to the last
        for(let i = 1; i < blocks.length; i++) {
            let block = Block.createFromJson(blocks[i]);


            // Validate that all block fields are present and have valid values
            if(typeof block.index !== 'number') error(`Invalid block[${i}].index value`);
            if(!Array.isArray(block.transactions)) error(`Invalid block[${i}].transactions value`);
            if(typeof block.difficulty !== 'number') error(`Invalid block[${i}].difficulty value`);
            if(typeof block.prevBlockHash !== 'string') error(`Invalid block[${i}].prevBlockHash value`);
            if(typeof block.minedBy !== 'string') error(`Invalid block[${i}].minedBy value`);
            if(typeof block.blockDataHash !== 'string') error(`Invalid block[${i}].blockDataHash value`);
            if(typeof block.nonce !== 'number') error(`Invalid block[${i}].nonce value`);
            if(!utils.isISO8601Date(block.dateCreated)) error(`Invalid block[${i}].dateCreated value`);
            if(typeof block.blockHash !== 'string') error(`Invalid block[${i}].blockHash value`);


            // Validate the transactions in the block
            for(let j = 0; j < block.transactions.length; j++) {
                let transaction = block.transactions[j];


                // Validate transaction fields and their values, recalculate the transaction data hash, validate the signature
                if(typeof transaction.from !== 'string') error(`Invalid block[${i}].transaction[${j}].from value`);
                if(typeof transaction.to !== 'string') error(`Invalid block[${i}].transaction[${j}].to value`);
                if(typeof transaction.value !== 'number') error(`Invalid block[${i}].transaction[${j}].value value`);
                if(typeof transaction.fee !== 'number') error(`Invalid block[${i}].transaction[${j}].fee value`);
                if(!utils.isISO8601Date(transaction.dateCreated)) error(`Invalid block[${i}].transaction[${j}].dateCreated value`);
                if(typeof transaction.senderPubKey !== 'string') error(`Invalid block[${i}].transaction[${j}].senderPubKey value`);
                if(!Array.isArray(transaction.senderSignature) && transaction.senderSignature.length !== 2) error(`Invalid block[${i}].transaction[${j}].senderSignature value`);

                transaction = Transaction.createFromJson(transaction);
                transaction.calculateDataHash();
                if(!transaction.isValidSignature()) error(`Invalid block[${i}].transaction[${j}].senderSignatures`);


                // Re-execute all transactions, re-calculate the values of minedInBlockIndex and transferSuccessful fields
                confirmedBalances[transaction.from] = confirmedBalances[transaction.from] || 0;
                confirmedBalances[transaction.to] = confirmedBalances[transaction.to] || 0;

                if(confirmedBalances[transaction.from] < transaction.fee) error(`An invalid transaction was found in block ${i}`);
                confirmedBalances[transaction.from] -= transaction.fee;

                transaction.minedInBlockIndex = block.index;
                if(confirmedBalances[transaction.from] < transaction.value) transaction.transferSuccessful = false;
                else {
                    confirmedBalances[transaction.from] -= transaction.value;
                    confirmedBalances[transaction.to] += transaction.value;
                    transaction.transferSuccessful = true;
                }
            }


            // Re-calculate the block data hash and block hash for each block
            block.calculateDataHash();
            block.calculateHash();


            // Validate that prevBlockHash == the hash of the previous block
            if(block.prevBlockHash !== blocks[i - 1].blockHash) error(`block[${i}].prevBlockHash did not match`);


            validatedBlocks.push(block);
        }

        return validatedBlocks;
    }

    async syncPeerByInfo(peerInfo) {
        let myInfo = this.getInfo();

        // sync blocks
        if(myInfo.blocksCount < peerInfo.blocksCount) {
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

        // sync peer
        await this.syncPeerByInfo(data);

        // resolve promise
        return true;
    }
};