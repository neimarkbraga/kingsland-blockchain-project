<template>
     <div id="checkBalanceTab" class="row center-align">
        <form class="col s12" v-on:submit.prevent="loadBalance">
            <div class="row">
                <div class="input-field col offset-s3 s6">
                    <input id="Address" type="text" class="validate" name=Address v-model="address">
                    <label for="Address">Enter Address</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col offset-s3 s6">
                    <input id="Balance-Node" type="text" class="validate" name=Balance-Node v-model="node">
                    <label for="Balance-Node">Enter Blockchain Node</label>
                </div>
            </div>
            <div class="row">
                <button class="btn-large blue center-align">Check Balance</button>
            </div>
        </form>

        <div class="row">
            <div class="col offset-s3 s6">
                <div class="card">
                    <div class="card-content">
                        <table class="highlight">
                            <tbody>
                                <tr>
                                    <td><b>Confirmed Balance</b></td>
                                    <td v-if="balance">{{ balance.confirmedBalance }}</td>
                                </tr>
                                <tr>
                                    <td><b>Pending Balance</b></td>
                                    <td v-if="balance">{{ balance.pendingBalance }}</td>
                                </tr>
                                <tr>
                                    <td><b>Safe Balance</b></td>
                                    <td v-if="balance">{{ balance.safeBalance }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    #checkBalanceTab {
        padding-top: 15vh;
    }
</style>

<script>
    const axios = require('axios');

    export default {
        data() {
            return {
                address: undefined,
                node: undefined,
                balance: undefined
            }
        },
        methods: {
            async loadBalance() {
                try {
                    const response = await axios.get(this.node + '/address/' + this.address + '/balance');
                    this.balance = response.data;
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    }
</script>
