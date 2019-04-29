const express = require('express');
const Node = require('./../classes/Node.js');
let app = express.Router();

// endpoints here!
app.get('/test', async (req, res) => {
    res.json('Hello World!');
});

app.get('/info', async (req, res) => {
    let node = new Node("Sample About", "Sample Node Url");
    res.json(node);
});

module.exports = app;