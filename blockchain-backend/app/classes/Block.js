const utils = require('../libraries/utils');

module.exports = class Block {
    constructor(index = 0,
                transactions = [],
                difficulty = 0,
                prevBlockHash = undefined,
                minedBy = 0,
                blockDataHash = undefined,
                nonce = 0,
                dateCreated = new Date(),
                blockHash = undefined)
    {
        this.index          = index;
        this.transactions   = transactions;
        this.difficulty     = difficulty;
        this.prevBlockHash  = prevBlockHash;
        this.minedBy        = minedBy;
        this.blockDataHash  = blockDataHash || this.getDataHash();
        this.nonce          = nonce;
        this.dateCreated    = dateCreated;
        this.blockHash      = blockHash || this.getHash();
    }

    getDataHash() {
        return utils.sha256(JSON.stringify({
            index: this.index,
            transactions: this.transactions,
            difficulty: this.difficulty,
            prevBlockHash: this.prevBlockHash,
            minedBy: this.minedBy
        }));
    }

    getHash() {
        return utils.sha256(`${this.blockDataHash}|${this.dateCreated}|${this.nonce}`);
    }

    getTransactionByHash() {
        return 0;
    }

    getConfirmedTransactions() {
        return transactions.filter((transactions) => {
            return transactions.isConfirmed();
        });
    }

    getPendingTransactions() {
        return transactions.filter((transactions) => {
            return transactions.isPending();
        });
    }

    toJSON() {
        return {
            index:          this.index,
            transactions:   this.transactions,
            difficulty:     this.difficulty,
            prevHash:       this.prevHash,
            minedBy:        this.minedBy,
            blockDataHash:  this.blockDataHash,
            nonce:          this.nonce,
            dateCreated:    this.dateCreated,
            blockHash:      this.blockHash
        }
    }
};