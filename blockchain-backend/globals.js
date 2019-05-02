const config = require('./config');
const Node = require('./app/classes/Node');

module.exports = {
    node: new Node({
        protocol: config.node_protocol,
        host: config.node_host,
        port: config.node_port
    })
};