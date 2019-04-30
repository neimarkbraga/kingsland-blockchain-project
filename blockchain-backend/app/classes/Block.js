module.exports = class Block {
    constructor(index = 0) {
        this.index         = index;
        this.transactions  = [];
        this.difficulty    = 0;
        this.minedBy       = 0;
        this.blockDataHash = 0;
        this.nonce         = 0;
        this.dateCreated   = 0;
        this.blockHash     = 0;
        this.prevHash      = 0;
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