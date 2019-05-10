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
                <table class="truncated-table striped centered">
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

                        <!-- loading -->
                        <tr v-if="isLoading">
                            <td colspan="8">
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
                            <td colspan="8" class="red-text">
                                <span>{{ errorMessage }}</span>
                                <button type="button"
                                        @click.prevent="loadConfirmedTxs"
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

<script>
    const axios = require('axios');
    const timeago = require('timeago.js');
        import utils from '../../../library/utils';

    export default {
        name: "Confirmed",
        data() {
            return {
                transactions: [],
                isLoading: false,
                errorMessage: ''
            }
        },
        created() {
            this.loadConfirmedTxs();
        },
        methods: {
            async loadConfirmedTxs() {
                try {
                    this.isLoading = true;
                    this.errorMessage = '';
                    const url = window.APP_CONFIG.blockchain_node_url;
                    const response = await axios.get(`${url}/transactions/confirmed`);
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