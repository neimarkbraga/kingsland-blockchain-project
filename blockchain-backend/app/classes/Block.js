const utils = require('../libraries/utils');

module.exports = class Block {
    constructor(index = 0,
                transactions = [],
                difficulty = 0,
                prevHash = undefined,
                minedBy = 0,
                blockDataHash = utils.sha256({
                                    "index" : index,
                                    "transactions" : transactions,
                                    "difficulty" : difficulty,
                                    "prevHash" : prevHash,
                                    "minedBy" : minedBy
                                }),
                nonce = 0,
                dateCreated = new Date(),
                blockHash = "hash")
    {
        this.index         = index;
        this.transactions  = transactions;
        this.difficulty    = difficulty;
        this.prevHash      = prevHash;
        this.minedBy       = minedBy;
        this.blockDataHash = blockDataHash;
        this.nonce         = nonce;
        this.dateCreated   = dateCreated;
        this.blockHash     = blockHash;
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