<template>
    <div class="container">
        <div class="row">
            <div class="col s12">
                <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
                <router-link :to="{name: 'confirmed'}" class="breadcrumb dark" v-if="transaction.minedInBlockIndex !== undefined">
                    Confirmed Transactions
                </router-link>
                <router-link :to="{name: 'pending'}" class="breadcrumb dark" v-else>
                    Pending Transactions
                </router-link>
                <router-link :to="'/explorer/transactions/' + $route.params.txhash" class="breadcrumb dark">
                    {{ $route.params.txhash }}
                </router-link>
            </div>
        </div>

        <div v-if="transaction" class="row tx-container">
            <div class="col s12">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">
                            <b>Tx: </b>
                            <i>{{ transaction.transactionDataHash }}</i>
                        </span>

                        <table class="highlight">
                            <tbody>
                                <tr>
                                    <td><b>From:</b></td>
                                    <td>
                                        <router-link :to="'/explorer/address/' + transaction.from">
                                            {{ transaction.from }}
                                        </router-link>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>To:</b></td>
                                    <td>
                                        <router-link :to="'/explorer/address/' + transaction.to">
                                            {{ transaction.to }}
                                        </router-link>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Value:</b></td>
                                    <td>{{ transaction.value }}</td>
                                </tr>
                                <tr>
                                    <td><b>Fee:</b></td>
                                    <td>{{ transaction.fee }}</td>
                                </tr>
                                <tr>
                                    <td><b>Data:</b></td>
                                    <td>{{ transaction.data }}</td>
                                </tr>
                                <tr v-if="transaction.minedInBlockIndex !== undefined">
                                    <td><b>Included in Block:</b></td>
                                    <td>
                                        <router-link :to="'/explorer/blocks/' + transaction.minedInBlockIndex">
                                            {{ transaction.minedInBlockIndex }}
                                        </router-link>
                                    </td>
                                </tr>
                                <tr v-if="transaction.confirmations !== 0">
                                    <td><b>Confirmations:</b></td>
                                    <td>{{ transaction.confirmations }}</td>
                                </tr>
                                <tr>
                                    <td><b>Date Created:</b></td>
                                    <td>{{ transaction.dateCreated }} ({{ transaction.age }})</td>
                                </tr>

                                <tr>
                                    <td><b>Status:</b></td>
                                    <td>
                                        <span v-if="transaction.minedInBlockIndex === undefined"
                                              class="new badge orange accent-4"
                                              data-badge-caption="Pending">
                                        </span>
                                        <span v-else-if="transaction.transferSuccessful"
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
        </div>
    </div>
</template>

<style scoped>
    table {
        margin-top: 5vh;
    }
</style>

<script>
    const axios = require('axios');
    const timeago = require('timeago.js');

    export default {
        name: "TxHash",
        data() {
            return {
                transaction: undefined
            }
        },
        methods: {
            async loadTransaction() {
                try {
                    const url = window.APP_CONFIG.blockchain_node_url;
                    const response = await axios.get(`${url}/transactions/${this.$route.params.txhash}`);
                    console.log(response.data);

                    this.transaction = response.data;
                    this.transaction.age = timeago.format(response.data.dateCreated);
                }
                catch(error) {
                    console.log(error);
                }
            }
        },
        mounted() {
            this.loadTransaction();
        }
    }
</script>