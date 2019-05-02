const express = require('express');
const bodyParser = require('body-parser');
const commander = require('commander');
const cors = require('cors');
const config = require('./config');

// init app
let app = express();

// process.argv
commander.option('-h, --host [value]');
commander.option('-p, --port [value]');
commander.parse(process.argv);
config.node_host = commander.host || config.node_host;
config.node_port = commander.port || config.node_port;


// allow cross origin
app.use(cors({origin: true}));


// parse body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// init routes
app.use('/', require('./app/routes/index'));
app.use('/debug', require('./app/routes/debug'));
app.use('/blocks', require('./app/routes/blocks'));
app.use('/transactions', require('./app/routes/transactions'));
app.use('/balances', require('./app/routes/balances'));
app.use('/address', require('./app/routes/address'));
app.use('/peers', require('./app/routes/peers'));
app.use('/mining', require('./app/routes/mining'));


// start server
let server = app.listen(commander.port || config.node_port, () => {
    let address = server.address();
    console.log(`Server running @ port ${address.port}`);
});