const utils = require('../libraries/utils');

module.exports = class Transaction {

    constructor(from, to, value, fee, dateCreated, data, senderPubKey, transactionDataHash, senderSignature, minedInBlockIndex, transferSuccessful) {
        this.from                   = from;
        this.to                     = to;
        this.value                  = value;
        this.fee                    = fee;
        this.dateCreated            = dateCreated;
        this.data                   = data;
        this.senderPubkey           = this.getDataHash();
        this.transactionDataHash    = transactionDataHash;
        this.senderSignature        = senderSignature;
        this.minedInBlockIndex      = minedInBlockIndex;
        this.transferSuccessful     = transferSuccessful;
    }

    // get data hash
    getDataHash() {
        return utils.sha256(JSON.stringify({
            from:           this.from,
            to:             this.to,
            value:          this.value,
            fee:            this.fee,
            dateCreated:    this.dateCreated,
            data:           this.data,
            senderPubkey:   this.senderPubkey
        }));
    }
};