module.exports = class Transaction {
    constructor() {
        this.from                = 0;
        this.to                  = 0;
        this.value               = 0;
        this.fee                 = 0;
        this.dateCreated         = 0;
        this.data                = 0;
        this.senderPubkey        = 0;
        this.transactionDataHash = 0;
        this.senderSignature     = []; // array
        this.minedInBlockIndex   = 0;
        this.transferSuccessful  = false;
    }
};