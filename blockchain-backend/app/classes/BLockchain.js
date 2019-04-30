

module.exports = class BlockChain {

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
};