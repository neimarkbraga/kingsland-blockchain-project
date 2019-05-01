const express = require('express');
const utils = require('../libraries/utils');
const globals = require('../../globals');
let app = express.Router();

// endpoints here!
app.get('/address/:address/balance', (req, res) => {
    let address = req.params.address;
    if(utils.isValidAddress(address)) res.json(globals.node.chain.getAddressBalance(address));
    else {
        res.status(400);
        res.json({
            errorMsg: 'Invalid address'
        });
    }
});

module.exports = app;