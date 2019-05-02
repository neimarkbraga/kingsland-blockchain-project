const express = require('express');
const globals = require('../../globals');
let app = express.Router();

// endpoints here!
app.get('/', (req, res) => {
    res.json(globals.node.chain.getConfirmedBalances());
});


module.exports = app;