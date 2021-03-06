const utils = require('../libraries/utils');
const Transaction = require('./Transaction');

module.exports = class Block {
    constructor(index,
                transactions,
                difficulty,
                prevBlockHash,
                minedBy,
                blockDataHash,
                nonce,
                dateCreated,
                blockHash)
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

    static createFromJson(data) {
        return new Block(
            data.index,
            Array.isArray(data.transactions)? data.transactions.map(a => Transaction.createFromJson(a)) : data.transactions,
            data.difficulty,
            data.prevBlockHash,
            data.minedBy,
            data.blockDataHash,
            data.nonce,
            data.dateCreated,
            data.blockHash
        );
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

    calculateDataHash() {
        this.blockDataHash = this.getDataHash();
    }

    getHash() {
        return utils.sha256(`${this.blockDataHash}|${this.dateCreated}|${this.nonce}`);
    }

    calculateHash() {
        this.blockHash = this.getHash();
    }

    isValidHashDifficulty(difficulty) {
        if(typeof difficulty !== 'number') difficulty = this.difficulty;
        if(difficulty) {
            let pattern = new RegExp(`^0{${difficulty}}`);
            return pattern.test(this.blockHash);
        }
        return true;
    }
};