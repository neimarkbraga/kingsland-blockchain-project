<template>
    <div class="container">
        <div class="row">
            <div class="col s12">
                <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
                <router-link to="/explorer/address" class="breadcrumb dark">Address</router-link>
                <router-link :to="'/explorer/address/' + $route.params.address" class="breadcrumb dark">
                    {{ this.$route.params.address }}
                </router-link>
            </div>
        </div>

        <div class="row">
            <div class="col s12">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">
                            <b>Address: </b>
                            <i>{{ $route.params.address }}</i>
                        </span>
                        <table v-if="balance" class="highlight">
                            <tbody>
                                <tr>
                                    <td><b>Safe Balance</b></td>
                                    <td>{{ balance.safeBalance }}</td>
                                </tr>
                                <tr>
                                    <td><b>Confirmed Balance</b></td>
                                    <td>{{ balance.confirmedBalance }}</td>
                                </tr>
                                <tr>
                                    <td><b>Pending Balance</b></td>
                                    <td>{{ balance.pendingBalance }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col s12">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">
                            <b>Transactions</b>
                        </span>

                        <table v-if="transactions" class="truncated-table striped centered">
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

</style>

<script>
    const axios = require('axios');
    const timeago = require('timeago.js');

    export default {
        data() {
            return {
                balance: undefined,
                transactions: undefined
            }
        },
        methods: {
            async loadAddressInfo() {
                try {
                    const url = window.APP_CONFIG.blockchain_node_url;
                    const balanceResp = await axios.get(`${url}/address/${this.$route.params.address}/balance`);
                    const transactionsResp = await axios.get(`${url}/address/${this.$route.params.address}/transactions`);

                    this.balance = balanceResp.data;
                    this.transactions = transactionsResp.data.reverse().map(transaction => {
                        transaction.age = timeago.format(transaction.dateCreated);
                        return transaction;
                    });
                }
                catch (error) {
                    console.log(error)
                }

            }
        },
        mounted() {
            this.loadAddressInfo();
        }
    }
</script>