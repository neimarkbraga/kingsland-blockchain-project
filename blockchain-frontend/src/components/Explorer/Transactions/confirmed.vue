<template>
    <div class="container">
        <div class="row">
            <div class="col s12">
                <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
                <router-link :to="{name: 'confirmed'}" class="breadcrumb dark">Confirmed Transactions</router-link>
            </div>
        </div>

        <div class="row">
            <div class="col s12">
                <table v-if="this.transactions" class="responsive-table striped centered">
                    <thead>
                        <tr>
                            <th id="transactionDataHash">Txn Hash</th>
                            <th id="minedInBlockIndex">Block</th>
                            <th id="age">Age</th>
                            <th id="from">From</th>
                            <th id="to">To</th>
                            <th id="value">Value</th>
                            <th id="fee">Txn Fee</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="transaction in transactions" v-bind:key="transaction.transactionDataHash">
                            <td class="truncate-td">
                                <router-link :to="'/explorer/transactions/' + transaction.transactionDataHash">
                                    {{ transaction.transactionDataHash }}
                                </router-link>
                            </td>
                            <td>
                                <router-link :to="'/explorer/blocks/' + transaction.minedInBlockIndex">
                                    {{ transaction.minedInBlockIndex }}
                                </router-link>
                            </td>
                            <td>
                                {{ transaction.age }}
                            </td>
                            <td class="truncate-td">
                                <router-link :to="'/explorer/address/' + transaction.from">
                                    {{ transaction.from }}
                                </router-link>
                            </td>
                            <td class="truncate-td">
                                <router-link :to="'/explorer/address/' + transaction.to">
                                    {{ transaction.to }}
                                </router-link>
                            </td>
                            <td>
                                {{ transaction.value }}
                            </td>
                            <td>
                                {{ transaction.fee }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>

    #transactionDataHash {
        width: 12vw;
    }

    #minedInBlockIndex {
        width: 1vw;
    }

    #age {
        width: 5vw
    }

    #from {
        width: 11vw;
    }

    #to {
        width: 11vw;
    }

    #value {
        width: 8vw;
    }

    #fee {
        width: 3.5vw;
    }


    td {
        max-width: 10px;
    }

    .truncate-td {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

<script>
    const axios = require('axios');
    const timeago = require('timeago.js');

    export default {

        name: "Confirmed",
        data() {
            return {
                transactions: []
            }
        },
        created() {
            console.log('Confirmed Txs Page Created');
            this.loadConfirmedTxs();

        },
        methods: {
            async loadConfirmedTxs() {
                try {
                    const url = window.APP_CONFIG.blockchain_node_url;
                    const response = await axios.get(`${url}/transactions/confirmed`);
                    this.transactions = response.data.reverse().map(transaction => {
                        transaction.age = timeago.format(transaction.dateCreated);
                        return transaction;
                    });

                }
                catch(error) {
                    console.log(error);
                }
            }
        }
    }
</script>