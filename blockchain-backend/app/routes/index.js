const express = require('express');
let app = express.Router();

// endpoints here!
app.get('/test', async (req, res) => {
    res.json('Hello World!');
});

app.get('/info', async (req, res) => {
    res.json(APP_NODE.toJSON());
});

module.exports = app;