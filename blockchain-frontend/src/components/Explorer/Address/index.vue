<template>
    <div class="container">
        <div class="row">
            <div class="col s12">
                <router-link to="/explorer" class="breadcrumb dark">Explorer</router-link>
                <router-link to="/explorer/address" class="breadcrumb dark">Address</router-link>
            </div>
        </div>

        <div class="row">
            <div class="col s12">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">
                            <b>Addresses</b>
                        </span>
                        <table class="highlight">
                            <tbody>
                                <tr v-for="(balance, address) in balances" v-bind:key="address">
                                    <td>
                                        <router-link :to="'/explorer/address/' + address">
                                            {{ address }}
                                        </router-link>
                                    </td>
                                    <td>
                                        <i>{{ balance }}</i>
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
                balances: undefined
            }
        },
        methods: {
            async loadBalances() {
                const url = window.APP_CONFIG.blockchain_node_url;
                const response = await axios.get(`${url}/balances`);

                this.balances = response.data;
            }
        },
        created() {
            this.loadBalances();
        }
    }
</script>