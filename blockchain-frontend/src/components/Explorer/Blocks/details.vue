<template>
    <div class="container">

        <!-- spacer -->
        <div style="height: 15px;"></div>

        <!-- breadcrumb -->
        <div>
            <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
            <router-link to="/explorer/blocks" class="breadcrumb dark">Blocks</router-link>
            <router-link :to="'/explorer/blocks/' + $route.params.index" class="breadcrumb dark">{{ $route.params.index }}</router-link>
        </div>

        <!-- block details -->
        <div class="card">
            <div class="card-content">

                <!-- title -->
                <div class="card-title">
                    <b>Block: </b>
                    <i>{{ $route.params.index }}</i>
                </div>

                <!-- loading -->
                <div v-if="status.loading" class="progress">
                    <div class="indeterminate"></div>
                </div>

                <!-- loaded -->
                <div v-else>

                    <!-- error -->
                    <div v-if="status.error">
                        <div style="height: 1em"></div>
                        <div class="card red center-align">
                            <div class="card-content white-text">
                                <span class="card-title">Error</span>
                                <p>{{ status.error }}</p>
                            </div>
                            <div class="card-action">
                                <button type="button"
                                        @click.prevent="loadDetails"
                                        class="btn">
                                    Reload
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- ready -->
                    <div v-else>
                        <table class="responsive-table striped">
                            <tbody>
                                <tr>
                                    <th>Height</th>
                                    <td>{{ block.index }}</td>
                                </tr>
                                <tr>
                                    <th>Transactions</th>
                                    <td>{{ block.transactions.length }}</td>
                                </tr>
                                <tr>
                                    <th>Difficulty</th>
                                    <td>{{ block.difficulty }}</td>
                                </tr>
                                <tr>
                                    <th>Mined By</th>
                                    <td>
                                        <router-link :to="'/explorer/address/' + block.minedBy">
                                            {{ block.minedBy }}
                                        </router-link>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Block Hash</th>
                                    <td>{{ block.blockHash }}</td>
                                </tr>
                                <tr v-if="block.prevBlockHash">
                                    <th>Previous Block Hash</th>
                                    <td>{{ block.prevBlockHash }}</td>
                                </tr>
                                <tr>
                                    <th>Block Data Hash</th>
                                    <td>{{ block.blockDataHash }}</td>
                                </tr>
                                <tr>
                                    <th>Date Created</th>
                                    <td>
                                        <span>{{ block.dateCreated }} </span>
                                        <span class="grey-text">({{ block.age }})</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Nonce</th>
                                    <td>{{ block.nonce }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- block transactions -->
        <div v-if="!status.loading && !status.error" class="card">
            <div class="card-content">

                <!-- title -->
                <div class="card-title">
                    <b>Transactions</b>
                </div>


                <table class="truncated-table striped centered">
                    <thead>
                    <tr>
                        <th>Hash</th>
                        <th>Age</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Value</th>
                        <th>Fee</th>
                        <th>Transfer</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(transaction, index) in block.transactions" :key="index">
                        <td>
                            <router-link :to="'/explorer/transactions/' + transaction.transactionDataHash">
                                {{ transaction.transactionDataHash }}
                            </router-link>
                        </td>
                        <td>{{ transaction.age }}</td>
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
                        <td>{{ transaction.value }}</td>
                        <td>{{ transaction.fee }}</td>
                        <td>
                            <span v-if="transaction.transferSuccessful" class="new badge green" data-badge-caption="Success"></span>
                            <span v-else class="new badge red" data-badge-caption="Failed"></span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>


        <!-- spacer -->
        <div style="height: 50px;"></div>
    </div>
</template>
<script>
    const timeago = require('timeago.js');
    import axios from 'axios';
    import utils from '../../../library/utils';

    export default {
        data() {
            return {
                block: null,
                status: {
                    loading: true,
                    error: ''
                }
            }
        },
        methods: {
            async loadDetails() {
                let vm = this;
                try {
                    let url = window.APP_CONFIG.blockchain_node_url;
                    vm.status.loading = true;
                    vm.status.error = '';

                    let response = await axios.get(`${url}/blocks/${vm.$route.params.index}`);
                    vm.block = response.data;
                    vm.block.age = timeago.format(vm.block.dateCreated);
                    vm.block.transactions = vm.block.transactions.map(transaction => {
                        transaction.age = timeago.format(transaction.dateCreated);
                        return transaction;
                    });
                }
                catch (error) {
                    vm.status.error = utils.getErrorMessage(error);
                }
                vm.status.loading = false;
            }
        },
        created() {
            if(/^\d+$/.test(this.$route.params.index)) this.loadDetails();
            else this.$router.push('/explorer/blocks');
        }
    }
</script>