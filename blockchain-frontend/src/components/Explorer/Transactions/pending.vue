<template>
    <div class="container">
        <div>
            <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
            <router-link :to="{name: 'pending'}" class="breadcrumb dark">Transactions</router-link>
        </div>

        <div class="row" v-if="this.transactions">
            <div class="col s12">
                <table class="responsive-table striped centered">
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
                                {{ transaction.minedInBlockIndex }}
                            </td>
                            <td>
                                {{ transaction.age }}
                            </td>
                            <td class="truncate-td">
                                {{ transaction.from }}
                            </td>
                            <td class="truncate-td">
                                {{ transaction.to }}
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

        name: "Pending",
        data() {
            return {
                transactions: undefined
            }
        },
        created() {
            this.loadPendingTxs();

        },
        methods: {
            async loadPendingTxs() {
                try {
                    const url = window.APP_CONFIG.blockchain_node_url;
                    const response = await axios.get(`${url}/transactions/pending`);
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