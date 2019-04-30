const Block = require("./Block");

module.exports = class BlockChain {

    constructor() {
        this.blocks = [this.createGenesisBlock()]; //genesis block inside
        this.pendingTransactions = [];
        this.currentDifficulty = 0;
        this.miningJobs = [] //map
    }

    createGenesisBlock() {
        return new Block();
    }

    resetChain() {
        this.blocks = [];
    }


    getBlockByIndex(index) {
        return this.blocks[index];
    }

    getBlocks () {
        return this.blocks;
    }
};