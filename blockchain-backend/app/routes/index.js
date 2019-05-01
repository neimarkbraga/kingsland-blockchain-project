const express = require('express');
const globals = require('../../globals');
let app = express.Router();

// endpoints here!
app.get('/test', async (req, res) => {
    res.json('Hello World!');
});

app.get('/info', async (req, res) => {
    res.json(globals.node.getInfo());
});

module.exports = app;