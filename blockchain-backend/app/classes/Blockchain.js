const Block = require("./Block");

module.exports = class BlockChain {

    constructor() {
        this.genesisBlock = this.createGenesisBlock();
        this.blocks = [this.genesisBlock];
        this.pendingTransactions = [];
        this.currentDifficulty = 0;
        this.miningJobs = [] //map
    }

    createGenesisBlock() {
        return new Block();
    }

    resetChain() {
        this.blocks = [this.genesisBlock];
    }


    getBlockByIndex(index) {
        return this.blocks[index];
    }

    getBlocks () {
        return this.blocks;
    }
};