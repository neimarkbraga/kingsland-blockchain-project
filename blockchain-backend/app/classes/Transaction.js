const utils = require('../libraries/utils');

module.exports = class Transaction {

    constructor(from,
                to,
                value,
                fee,
                dateCreated,
                data,
                senderPubKey,
                transactionDataHash,
                senderSignature,
                minedInBlockIndex,
                transferSuccessful)
    {
        this.from                   = from;
        this.to                     = to;
        this.value                  = value;
        this.fee                    = fee;
        this.dateCreated            = dateCreated;
        this.data                   = data;
        this.senderPubKey           = senderPubKey;
        this.transactionDataHash    = transactionDataHash || this.getDataHash();
        this.senderSignature        = senderSignature;
        this.minedInBlockIndex      = minedInBlockIndex;
        this.transferSuccessful     = transferSuccessful;
    }
    getDataHash() {
        return utils.sha256(JSON.stringify({
            from:           this.from,
            to:             this.to,
            value:          this.value,
            fee:            this.fee,
            dateCreated:    this.dateCreated,
            data:           this.data,
            senderPubKey:   this.senderPubKey
        }));
    }

    getConfirmations(blocksCount) {
        if(this.minedInBlockIndex === undefined) return 0;
        return blocksCount - this.minedInBlockIndex;
    }

    isValidSignature() {
        return utils.isValidSignature(this.transactionDataHash, this.senderPubKey, this.senderSignature);
    }

    isConfirmed() {
        return typeof this.minedInBlockIndex === 'number' && this.transferSuccessful;
    }

    isPending() {
        return this.minedInBlockIndex === undefined;
    }
};