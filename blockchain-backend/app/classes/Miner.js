const utils = require('./../libraries/utils');
const Block = require('./Block');
const Transaction = require('./Transaction');

module.exports = class Miner {
    constructor(address, difficulty, currBlockIndex, prevBlockHash, pendingTxs) {
        this.address = address;
        this.difficulty = difficulty;
        this.currBlockIndex = currBlockIndex;
        this.prevBlockHash = prevBlockHash;
        this.pendingTxs = pendingTxs;

        this.mineBlock();
    }

    submitMinersHash() {
        // submit blockDataHash, dateCreated, blockHash
        // res 200 message: Block accepted, reward paid: 50000000000 microcoins
        // res 404 errorMsg: Block not found or already mined
        return 0;
    }

    mineBlock() {
        let blockHash = 0;
        let nonce = 0;
        let difficultyStr = utils.createDifficultyStr(this.difficulty);

        while (!blockHash.toString().startsWith(difficultyStr)) //difficulty: 5
        {
            blockHash = utils.sha256(`${this.blockDataHash}|${new Date()}|${nonce++}`);
        }

        let coinbaseTx = Transaction.createCoinbaseTx();

        return new Block(
                            this.currBlockIndex,
                            [coinbaseTx, this.pendingTxs],
                            this.difficulty,
                            this.prevBlockHash,
                            this.address,
                            0,
                            nonce,
                            new Date(),
                            blockHash
                        );
    }

    requestBlockForMining() {
        //Give address to Node (Mining Pool) for it to create CoinBase Tx
        return 0;
    }
}