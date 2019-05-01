const config = require('./config');
const Node = require('./app/classes/Node');

module.exports = {
    node: new Node(`${config.node_protocol}://${config.node_host}:${config.node_port}`)
};