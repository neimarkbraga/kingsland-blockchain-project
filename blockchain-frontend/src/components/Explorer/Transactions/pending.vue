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
                        <!-- loading -->
                        <tr v-if="isLoading">
                            <td colspan="6">
                                <div class="preloader-wrapper small active">
                                    <div class="spinner-layer spinner-blue-only">
                                        <div class="circle-clipper left">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="gap-patch">
                                            <div class="circle"></div>
                                        </div>
                                        <div class="circle-clipper right">
                                            <div class="circle"></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- error -->
                        <tr v-if="!isLoading && errorMessage">
                            <td colspan="6" class="red-text">
                                <span>{{ errorMessage }}</span>
                                <button type="button"
                                        @click.prevent="loadPendingTxs"
                                        class="btn btn-small ml-3">
                                    Reload
                                </button>
                            </td>
                        </tr>

                        <!-- transactions -->
                        <tr v-show="!isLoading && !errorMessage" v-for="transaction in transactions" v-bind:key="transaction.transactionDataHash">
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

                        <!-- no transactions -->
                        <tr v-if="!isLoading && !errorMessage && !transactions.length">
                            <td colspan="6">
                                No Pending Transactions Yet
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
    import utils from '../../../library/utils';

    export default {

        name: "Pending",
        data() {
            return {
                transactions: [],
                isLoading: false,
                errorMessage: ''
            }
        },
        created() {
            this.loadPendingTxs();
        },
        methods: {
            async loadPendingTxs() {
                try {
                    this.isLoading = true;
                    this.errorMessage = '';
                    const url = window.APP_CONFIG.blockchain_node_url;
                    const response = await axios.get(`${url}/transactions/pending`);
                    this.transactions = response.data.reverse().map(transaction => {
                        transaction.age = timeago.format(transaction.dateCreated);
                        return transaction;
                    });
                }
                catch(error) {
                    this.errorMessage = utils.getErrorMessage(error);
                }
                this.isLoading = false;
            }
        }
    }
</script>