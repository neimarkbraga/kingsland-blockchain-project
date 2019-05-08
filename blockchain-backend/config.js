module.exports = {
    genesis_date: '2019-05-08T13:50:00.000Z',//'2018-01-01T00:00:00.000Z',
    target_block_time: null, // seconds  (set null for static difficulty)
    start_difficulty: 4,
    safe_confirms: 6,
    block_reward: 5000000,
    coinbase_tx_data: 'coinbase tx',

    default_address: '0000000000000000000000000000000000000000',
    default_public_key: '00000000000000000000000000000000000000000000000000000000000000000',
    default_sender_signature: [
        '0000000000000000000000000000000000000000000000000000000000000000',
        '0000000000000000000000000000000000000000000000000000000000000000'
    ],

    faucet_private_key: '988461d527a57d6b8f50186b6ec25d7aecc77c815e865b88641834c668c8a661',
    faucet_public_key: '5b48b72f8ce56444046e8e158aed06c4390c3ee121be97f18eff56c480f1e0990',
    faucet_address: '50e5f5d8d31566d759fce46b210c7ea88d303abb',
    faucet_init_value: 1000000000000,
    faucet_tx_value: 500,
    faucet_tx_fee: 10,
    faucet_tx_data: 'faucet tx',

    node_protocol: 'http',
    node_host: 'localhost',
    node_port: 5555,

    google_recaptcha_site_key: '6Lccp6EUAAAAABbDdXRIa949LoVEVuPQQoPTUhAl',
    google_recaptcha_secret_key: '6Lccp6EUAAAAAEIg3FVhGh92L4qJ-EWsmvq_6xhY'
};