const axios = require('axios');
const utils = require('../libraries/utils');
const BlockChain = require('./Blockchain');

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
            currentDifficulty: undefined,
            blocksCount: this.chain.blocks.length,
            cumulativeDifficulty: undefined,
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

    async addPeerByUrl(url) {
        let myInfo = this.getInfo();
        let response = await axios.get(`${url}/info`);
        let data = response.data;
        if(data.chainId !== myInfo.chainId) throw new Error('Chain ID di not match.');
        if(data.nodeId === myInfo.nodeId) throw new Error('Cannot connect to self.');

        // add in peers if not exist
        if(this.peers[data.nodeId] !== url) {
            // eliminate url duplication
            for(let id in this.peers) if(this.peers[id] === url) delete this.peers[id];

            // add to peers
            this.peers[data.nodeId] = url;

            // connect back
            await axios.post(`${url}/peers/connect`, {url: this.selfUrl});

            // check two peer block chain
            // to be coded
        }
    }
};