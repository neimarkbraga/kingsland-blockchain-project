const utils = require('../libraries/utils');
const BlockChain = require('./Blockchain');

module.exports = class Node {

    constructor(selfUrl) {
        this.nodeId  = utils.sha256(new Date().getTime() + Math.random());
        this.selfUrl = selfUrl;
        this.peers   = [];
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

    toJSON() {
        return {
           nodeId: this.nodeId,
           selfUrl: this.selfUrl,
           peers: this.peers,
           chain: this.chain
        }
    }
};