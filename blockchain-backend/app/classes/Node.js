const utils = require('../libraries/utils');
//To understand or clarify:
// balance = {safeBalance, confirmedBalance, pendingBalance}
//
// 1. List Transaction for Address
// 2. Get Balance for Address (for Valid and Invalid address)
// 3. Send Transaction.
// 4. Get Mining Job
// 5. SubmitBlock
// 6. Debug: Mine a Block
// 7. Debug: Node

module.exports = class Node {

    constructor(about, nodeUrl) {
        this.about                 = about;
        this.nodeId                = utils.sha256((new Date().getTime() + Math.random()).toString());
        this.chainId               = 0;
        this.nodeUrl               = nodeUrl;
        this.peers                 = [];
        this.currentDifficulty     = 0;
        this.blocksCount           = 0;
        this.cummulativeDifficulty = 0;
        this.confirmedTransactions = 0;
        this.pendingTransactions   = 0;
        // to include miningJobs
        // to include balances
        // to include blocks
    }

    getAllBalances() {
        return 0;
    }

    getPeers() {
        return 0;
    }
};