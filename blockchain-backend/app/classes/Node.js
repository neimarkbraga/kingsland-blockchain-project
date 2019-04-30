const utils = require('../libraries/utils');
const BlockChain = require('./Blockchain');

module.exports = class Node {

    constructor(selfUrl) {
        this.nodeId  = utils.sha256(new Date().getTime() + Math.random());
        this.selfUrl = selfUrl;
        this.peers   = [];
        this.chain   = new BlockChain;
    }

    getAllBalances() {
        return 0;
    }

    getPeers() {
        return 0;
    }
};