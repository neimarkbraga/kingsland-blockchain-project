module.exports = class Miner {
    constructor(address, difficulty, blockDataHash) {
        this.address = address;
        this.difficulty = difficulty;
        this.blockDataHash = blockDataHash;
        this.balance = 0 // to clarify where to put Reward Coins
    }

    submitMinersHash() {
        // submit blockDataHash, dateCreated, blockHash
        // res 200 message: Block accepted, reward paid: 50000000000 microcoins
        // res 404 errorMsg: Block not found or already mined
        return 0;
    }

    calculateMinersHash() {
        let minersHash = 0;
        let dateCreated = new Date;
        let nonce = 0;

        // while (minersHash leading zeroes < difficulty)
        // nonce++
        // timeStamp = new Date
        // SHA256(blockDataHash + dateCreated + nonce ) = blockHash

        return 0;
    }

    requestBlockForMining() {
        //Give address to Node (Mining Pool) for it to create CoinBase Tx
        return 0;
    }
}