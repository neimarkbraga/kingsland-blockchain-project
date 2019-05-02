const utils = require('./../libraries/utils');

module.exports = class Miner {
    constructor(address, difficulty) {
        this.address = address;
        this.difficulty = difficulty
    }

    submitMinersHash() {
        // submit blockDataHash, dateCreated, blockHash
        // res 200 message: Block accepted, reward paid: 50000000000 microcoins
        // res 404 errorMsg: Block not found or already mined
        return 0;
    }

    mineBlock(candidateBlock) {
        let blockHash = 0;
        let nonce = 0;
        let timestamp = undefined;
        let difficultyStr = utils.createDifficultyStr(this.difficulty);

        while (!blockHash.toString().startsWith(difficultyStr))
        {
            timestamp = new Date();
            blockHash = utils.sha256(`${candidateBlock.blockDataHash}|${timestamp}|${++nonce}`);
        }

        candidateBlock.nonce = nonce;
        candidateBlock.dateCreated = timestamp;
        candidateBlock.blockHash = blockHash;
    }

    requestBlockForMining() {
        //Give address to Node (Mining Pool) for it to create CoinBase Tx
        return 0;
    }
}