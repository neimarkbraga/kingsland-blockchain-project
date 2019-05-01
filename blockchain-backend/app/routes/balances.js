const express = require('express');
const globals = require('../../globals');
let app = express.Router();

// endpoints here!
app.get('/', (req, res) => {
    let balances = globals.node.chain.getAllBalances();
    for(let address in  balances) balances[address] = balances[address].confirmedBalance;
    res.json(balances);
});


module.exports = app;