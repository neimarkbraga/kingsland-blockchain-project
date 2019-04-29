const express = require('express');
let app = express.Router();

// endpoints here!
app.get('/test', async (req, res) => {
    res.json('Hello World!');
});

module.exports = app;