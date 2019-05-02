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

    static createCoinbaseTx(minerAddress, reward = 5000000, blockIndex) {
        return new Transaction(
            "0000000000000000000000000000000000000000",
            minerAddress,
            reward,
            0,     //feee
            new Date(),
            "coinbase tx",
            "00000000000000000000000000000000000000000000000000000000000000000",
            null, // transactionDataHash
            ["0000000000000000000000000000000000000000000000000000000000000000",
            "0000000000000000000000000000000000000000000000000000000000000000"],
            blockIndex,
            false   // transferSuccessful
        );
    }

    static createFromJson(data) {
        return new Transaction(
            data.from,
            data.to,
            data.value,
            data.fee,
            data.dateCreated,
            data.data,
            data.senderPubKey,
            data.transactionDataHash,
            data.senderSignature,
            data.minedInBlockIndex,
            data.transferSuccessful
        );
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

    calculateDataHash() {
        this.transactionDataHash = this.getDataHash();
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