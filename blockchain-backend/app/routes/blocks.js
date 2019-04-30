const express = require('express');

let app = express.Router();

// endpoints here!
app.get('/', (req, res) => {
    res.json(APP_NODE.chain.blocks);
});

app.get('/:index', (req, res) => {
    let index = parseInt(req.params.index || 0) || 0;
    let block = APP_NODE.chain.blocks[index];

    if(block) res.json(block);
    else {
        res.status(404);
        res.json({errorMsg: 'Invalid block index'});
    }
});

module.exports = app;