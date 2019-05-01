const utils = require('../libraries/utils');
const BlockChain = require('./Blockchain');

module.exports = class Node {

    constructor(selfUrl) {
        this.nodeId  = utils.sha256(new Date().getTime() + Math.random());
        this.selfUrl = selfUrl;
        this.peers   = {};
        this.chain   = new BlockChain();
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
};