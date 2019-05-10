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
                <table v-if="this.transactions" class="truncated-table striped centered">
                    <thead>
                        <tr>
                            <th>Txn Hash</th>
                            <th>Block</th>
                            <th>Age</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Value</th>
                            <th>Txn Fee</th>
                            <th>Status</th>
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
                                <router-link :to="'/explorer/blocks/' + transaction.minedInBlockIndex">
                                    {{ transaction.minedInBlockIndex }}
                                </router-link>
                            </td>
                            <td>
                                {{ transaction.age }}
                            </td>
                            <td>
                                <router-link :to="'/explorer/address/' + transaction.from">
                                    {{ transaction.from }}
                                </router-link>
                            </td>
                            <td>
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
                            <td>
                                <span v-if="transaction.transferSuccessful"
                                      class="new badge green accent-4"
                                      data-badge-caption="Successful">
                                </span>
                                <span v-else
                                      class="new badge red accent-4"
                                      data-badge-caption="Failed">
                                </span>
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