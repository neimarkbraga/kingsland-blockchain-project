<template>
    <div class="container">
        <div>
            <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
            <router-link :to="{name: 'pending'}" class="breadcrumb dark">Pending Transactions</router-link>
        </div>

        <div class="row" v-if="this.transactions">
            <div class="col s12">
                <table class="truncated-table striped centered">
                    <thead>
                        <tr>
                            <th>Txn Hash</th>
                            <th>Age</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Value</th>
                            <th>Txn Fee</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="transaction in transactions" v-bind:key="transaction.transactionDataHash">
                            <td>
                                <router-link :to="'/explorer/transactions/' + transaction.transactionDataHash">
                                    {{ transaction.transactionDataHash }}
                                </router-link>
                            </td>
                            <td>
                                {{ transaction.age }}
                            </td>
                            <td>
                                {{ transaction.from }}
                            </td>
                            <td>
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