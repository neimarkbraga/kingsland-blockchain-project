const express = require('express');
const globals = require('../../globals');

let app = express.Router();

// endpoints here!
app.get('/', (req, res) => {
    res.json(globals.node.chain.getBlocks());
});

app.get('/:index', (req, res) => {
    let index = parseInt(req.params.index || 0) || 0;
    let block = globals.node.chain.getBlockByIndex(index);

    if(block) res.json(block);
    else {
        res.status(404);
        res.json({errorMsg: 'Invalid block index'});
    }
});

module.exports = app;