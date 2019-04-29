var CryptoJS = require("crypto-js");

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

class Node {

    constructor(about, nodeUrl) {
        this.about                 = about;
        this.nodeId                = CryptoJS.SHA256(new Date().getTime() +
                                                     Math.random()).toString();
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
}

class BlockChain {

    constructor() {
        this.id = 0;
        this.blocks = []; //genesis block inside
    }

    resetChain() {
        this.blocks = [];
    }

    getBlocks (params) {
        //All Blocks Sample
        [
            { "index": 0,
                "transactions": [
                    { "from": "0000000000000000000000000000000000000000",
                        "to": "f3a1e69b6176052fcc4a3248f1c5a91dea308ca9",
                        "value": 1000000000000,
                        "fee": 0,
                        "dateCreated": "2018-01-01T00:00:00.000Z",
                        "data": "genesis Tx",
                        "senderPubKey": "00000000000000000000000000000000000000000000000000000000000000000",
                        "transactionDataHash": "8a684cb8491ee419e7d46a0fd2438cad82d1278c340b5d01974e7beb6b72ecc2",
                        "senderSignature": [ "0000000000000000000000000000000000000000000000000000000000000000",  "0000000000000000000000000000000000000000000000000000000000000000"],
                        "minedInBlockIndex": 0,
                        "transferSuccessful": true
                    }
                ],

                "difficulty": 0,
                "minedBy": "0000000000000000000000000000000000000000",
                "blockDataHash": "15cc5052fb3c307dd2bfc6bcaa057632250ee05104e4fb7cc75e59db1a92cefc",
                "nonce": 0,
                "dateCreated": "2018-01-01T00:00:00.000Z",
                "blockHash": "c6da93eb4249cb5ff4f9da36e2a7f8d0d61999221ed6910180948153e71cc47f"
            }
        ]
        return this.blocks;
    }


}

class Block {
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
}

class Transaction {
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
}

module.exports = Node;