const utils = require('../libraries/utils');
const BlockChain = require('./Blockchain');

module.exports = class Node {

    constructor(selfUrl) {
        this.nodeId  = utils.sha256(new Date().getTime() + Math.random());
        this.selfUrl = selfUrl;
        this.peers   = [];
        this.chain   = new BlockChain();
    }

    getChain() {
        return this.chain;
    }


    getPeers() {
        return 0;
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