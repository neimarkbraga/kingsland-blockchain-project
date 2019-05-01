const express = require('express');
const globals = require('../../globals');

let app = express.Router();

// endpoints here!

app.get('/get-mining-job/:minerAddress', (req, res) => {
    let minerAddress = req.params.minerAddress || 0;

    globals.node.getChain().sendMiningJob(minerAddress);

    res.json(minerAddress);
});

module.exports = app;