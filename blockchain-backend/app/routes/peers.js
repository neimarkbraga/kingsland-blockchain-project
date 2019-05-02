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
        if(!body.peerUrl) throw new Error('peerUrl is required');
        await globals.node.addPeerByUrl(body.peerUrl);
        res.json({message: `Connected to peer: ${body.peerUrl}`});
    }
    catch (error) {
        res.status(400);
        res.json({
            errorMsg: error.message || 'Something went wrong'
        });
    }
});

module.exports = app;