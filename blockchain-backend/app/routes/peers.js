const express = require('express');
const axios = require('axios');
const globals = require('../../globals');
const Block = require('../classes/Block');
let app = express.Router();

// endpoints here!
app.get('/', (req, res) => {
     res.json(globals.node.peers);
});

app.post('/connect', async(req, res) => {
    try {
        let body = req.body;
        if(!body.peerUrl) throw new Error('peerUrl is required');
        let info = await globals.node.addPeerByUrl(body.peerUrl);
        await globals.node.syncPeerByInfo(info);
        res.json({message: `Connected to peer: ${body.peerUrl}`});
    }
    catch (error) {
        res.status(400);
        res.json({
            errorMsg: error.message || 'Something went wrong'
        });
    }
});

app.post('/notify-new-block', async(req, res) => {
    console.log('A new block notification was received from a peer.');
    try {
        let body = req.body;
        let syncAllBlocks = true;
        if(body.newBlock) {
            try {
                let candidateBlock = Block.createFromJson(body.newBlock);
                globals.node.chain.addBlock(candidateBlock);
                await globals.node.notifyNewBlock(candidateBlock);
                syncAllBlocks = false;
            } catch (error) {}
        }
        try {await globals.node.addPeerByUrl(body.nodeUrl);} catch (error) {}
        if(syncAllBlocks) {
            console.log('Syncing to peer\'s chain.');
            let chainChanged = await globals.node.syncPeerByInfo(body);
            if(chainChanged) await globals.node.notifyNewBlock();
            else console.log('Chain is already synced to peer\'s chain.');
        }
    }
    catch (error) { }
    res.json({ message: 'Thank you for the notification.' });
});

module.exports = app;