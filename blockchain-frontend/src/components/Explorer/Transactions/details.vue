<template>
    <div class="container">
        <div class="row">
            <div class="col s12">
                <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
                <router-link :to="{name: 'confirmed'}" class="breadcrumb dark" v-if="transaction && transaction.minedInBlockIndex !== undefined">
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

        <div>
            <div class="card">
                <div class="card-content">

                    <!-- title -->
                    <div class="card-title mb-4">
                        <b>Tx: </b>
                        <i>{{ $route.params.txhash }}</i>
                    </div>

                    <!-- loading -->
                    <div v-if="isLoading" class="progress">
                        <div class="indeterminate"></div>
                    </div>

                    <!-- loaded -->
                    <div v-else>

                        <!-- error -->
                        <div v-if="errorMessage" class="red card white-text p-2">
                            <p class="m-0">
                                <span>{{ errorMessage }}</span>
                                <button type="button"
                                        @click.prevent="loadTransaction"
                                        class="btn btn-small ml-3">
                                    Reload
                                </button>
                            </p>
                        </div>

                        <!-- no error -->
                        <div v-else>
                            <table v-if="transaction" class="highlight">
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
    </div>
</template>

<script>
    const axios = require('axios');
    const timeago = require('timeago.js');
    import utils from '../../../library/utils';

    export default {
        name: "TxHash",
        data() {
            return {
                transaction: undefined,
                isLoading: false,
                errorMessage: ''
            }
        },
        methods: {
            async loadTransaction() {
                this.isLoading = true;
                this.errorMessage = '';
                try {
                    const url = window.APP_CONFIG.blockchain_node_url;
                    const response = await axios.get(`${url}/transactions/${this.$route.params.txhash}`);
                    this.transaction = response.data;
                    this.transaction.age = timeago.format(response.data.dateCreated);
                }
                catch(error) {
                    this.errorMessage = utils.getErrorMessage(error);
                }
                this.isLoading = false;
            }
        },
        mounted() {
            this.loadTransaction();
        }
    }
</script>