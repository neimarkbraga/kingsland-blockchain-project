const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


// init app
let app = express();



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
let server = app.listen(process.env.APP_HTTP_PORT || 5555, () => {
    let address = server.address();
    console.log(`Server running @ port ${address.port}`);
});