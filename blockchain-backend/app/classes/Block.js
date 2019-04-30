const utils = require('../libraries/utils');

module.exports = class Block {
    constructor(index = 0) {
        this.index         = index;
        this.transactions  = [];
        this.difficulty    = 0;
        this.prevHash      = 0;
        this.minedBy       = 0;
        this.blockDataHash = utils.sha256({
                                "index" : this.index,
                                "transactions" : this.transactions,
                                "difficulty" : this.difficulty,
                                "prevHash" : this.prevHash,
                                "minedBy" : this.minedBy
                             });
        this.nonce         = 0;
        this.dateCreated   = 0;
        this.blockHash     = 0;
    }

    getTransactionByHash() {
        return 0;
    }

    getPendingTransactions() {
        return 0;
    }

    getConfirmedTransactions() {
        return 0;
    }
};