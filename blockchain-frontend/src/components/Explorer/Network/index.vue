<template>
    <div class="container">
        <div class="row">
            <div class="col s12">
                <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
                <router-link to="/explorer/network/" class="breadcrumb dark">
                    Network
                </router-link>
            </div>
        </div>

        <div class="row">
            <div v-if="network" class="col s12">
                <div class="card">
                    <div class="card-content">

                        <div class="card-title">
                            <span>
                                <b>Network: </b>
                                <i>{{ network.nodeUrl }}</i>
                            </span>
                        </div>

                        <table class="highlight">
                            <tbody>
                                <tr>
                                    <td>Blocks: </td>
                                    <td>{{ network.blocksCount }}</td>
                                </tr>
                                <tr>
                                    <td>Chain Id:</td>
                                    <td>{{ network.chainId }}</td>
                                </tr>
                                <tr>
                                    <td>Confirmed Transactions: </td>
                                    <td>{{ network.confirmedTransactions }}</td>
                                </tr>
                                <tr>
                                    <td>Pending Transactions: </td>
                                    <td>{{ network.pendingTransactions }}</td>
                                </tr>
                                <tr>
                                    <td>Peers: </td>
                                    <td>{{network.peers }}</td>
                                </tr>
                                <tr>
                                    <td>Difficulty: </td>
                                    <td>{{ network.currentDifficulty }}</td>
                                </tr>
                                <tr>
                                    <td>Cumulative Difficulty</td>
                                    <td>{{ network.cumulativeDifficulty }}</td>
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

    export default {
        data() {
            return {
                network: undefined
            }
        },
        methods: {
            async loadNetwork() {
                const url = window.APP_CONFIG.blockchain_node_url;
                const response = await axios.get(`${url}/info`);

                this.network = response.data;
                console.log(this.network);

            }
        },
        created() {
            this.loadNetwork();
        }
    }
</script>
