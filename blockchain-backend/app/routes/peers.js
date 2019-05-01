const express = require('express');
const globals = require('../../globals');
let app = express.Router();

// endpoints here!
app.get('/', (req, res) => {
     res.json(globals.node.peers);
});

app.post('/connect', async(req, res) => {
    try {
        let body = req.body;
        if(!body.url) throw new Error('url is required');
        await globals.node.addPeerByUrl(body.url);
        res.json({message: 'Connection success!'});
    }
    catch (error) {
        res.status(400);
        res.json({
            errorMsg: error.message || 'Something went wrong'
        });
    }
});

module.exports = app;