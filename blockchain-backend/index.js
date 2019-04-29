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


// start server
let server = app.listen(process.env.APP_HTTP_PORT || 5555, () => {
    let address = server.address();
    console.log(`Server running @ port ${address.port}`);
});