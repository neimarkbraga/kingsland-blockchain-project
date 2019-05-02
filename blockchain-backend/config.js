module.exports = {
    genesis_date: '2018-01-01T00:00:00.000Z',
    start_difficulty: 5,
    safe_confirms: 6,
    block_reward: 5000000,
    coinbase_tx_data: 'coinbase tx',


    default_address: '0000000000000000000000000000000000000000',
    default_public_key: '00000000000000000000000000000000000000000000000000000000000000000',
    default_sender_signature: [
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000'
    ],

    faucet_private_key: '',
    faucet_public_key: '',
    faucet_address: 'f3a1e69b6176052fcc4a3248f1c5a91dea308ca9',
    faucet_init_value: 1000000000000,

    node_protocol: 'http',
    node_host: 'localhost',
    node_port: 5555,
};