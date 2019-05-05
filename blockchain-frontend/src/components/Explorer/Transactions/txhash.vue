<template>
    <div class="container">
        <div class="col s12">
            <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
            <router-link :to="{name: 'confirmed'}" class="breadcrumb dark">Transactions</router-link>
            <router-link :to="'/explorer/transactions/' + $route.params.txhash" class="breadcrumb dark">{{ this.$route.params.txhash }}</router-link>
        </div>

        <div v-if="this.transaction" class="row tx-container">
            <div class="col s12">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">
                            <b>Tx: </b>
                            <i>{{ this.transaction.transactionDataHash }}</i>
                        </span>

                        <table class="highlight">
                            <thead>

                            </thead>
                            <tbody>
                                <tr>
                                    <td><b>From:</b></td>
                                    <td>{{ transaction.from }}</td>
                                </tr>
                                <tr>
                                    <td><b>To:</b></td>
                                    <td>{{ transaction.to }}</td>
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
                                    <td><b>Included in Block:</b></td>
                                    <td>
                                        <router-link :to="'/explorer/blocks/' + transaction.minedInBlockIndex">
                                            {{ transaction.minedInBlockIndex }}
                                        </router-link>
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Date Created:</b></td>
                                    <td>{{ transaction.dateCreated }} ({{ transaction.age }})</td>
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
    .tx-container {
        padding-top: 5vh;
    }

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