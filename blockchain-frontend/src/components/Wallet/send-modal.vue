<template>
    <div :id="id" ref="Modal" class="modal">
        <div class="modal-content center-align">

            <div class="row">
                <div class="input-field col s6">
                    <input id="Recipient" type="text" class="validate" name=Recipient v-model="transaction.recipient">
                    <label for="Recipient">Enter Recipient</label>
                </div>
                <div class="input-field col s6">
                    <input id="Value" type="number" min="1" class="validate" name=Value v-model="transaction.value">
                    <label for="Value">Enter Value</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s4">
                    <input id="Data" type="text" class="validate" name=Data v-model="transaction.data">
                    <label for="Data">Enter Data (optional)</label>
                </div>
                <div class="input-field col s4">
                    <input id="Fee" type="number" min="10" class="validate" name=Fee v-model="transaction.fee">
                    <label for="Fee">Enter Fee (Minimum: 10)</label>
                </div>
                <div class="input-field col s4">
                    <input id="Node" type="text" class="validate" name=Node v-model="node">
                    <label for="Node">Enter Blockchain Node</label>
                </div>
            </div>
            <div class="row">
                <button class="btn-large blue center-align waves-effect waves-light" v-on:click.prevent="sendTransaction">Send Transaction</button>
            </div>
            <p v-if="status.error !== null" class="red-text darken-4">{{status.error}}</p>
            <div v-else-if="status.success === true" class="green-text accent-4">
                <h5>Transaction Sent!</h5>
                <p><b>Transaction Hash:</b> <i>{{ transactionDataHash }}</i></p>
            </div>

        </div>
    </div>
</template>

<style scoped>

</style>


<script>
    const axios = require('axios');
    const elliptic = require('elliptic');
    const secp256k1 = elliptic.ec('secp256k1');
    import utils from './../../library/utils';

    export default {
        data() {
            return {
                status: {
                    error: null,
                    success: null
                },

                transaction: {
                    recipient : null,
                    value : 0,
                    data : null,
                    fee : 10
                },
                node: window.APP_CONFIG.blockchain_node_url,
                newTransaction: null,
                transactionDataHash: null,
                signedTransaction: null,
            }
        },
        mounted() {

            M.updateTextFields();
            $('.dropdown-trigger').dropdown();
            $('.modal').modal();

        },
        props: {
            id: {
                type: String,
                default: undefined
            },
            privateKey: {
                type: String,
                default: undefined
            },
            publicKey: {
                type: String,
                default: undefined
            },
            address: {
                type: String,
                default: undefined
            }
        },
        methods: {
            areInputsValid() {
                if (!this.privateKey) {
                    this.status.error = 'Please Load a Wallet First';
                    return false;
                }

                if (!this.transaction.recipient) {
                    this.status.error = 'Please enter a recipient';
                    return false;
                }

                if (!this.transaction.value) {
                    this.status.error = 'Please enter an amount to send';
                    return false;
                }

                if (!this.node) {
                    this.status.error = 'Please enter a node';
                    return false;
                }

                this.status.error = '';
                return true;
            },
            signTransaction() {
                let transactionInfo = {
                    "from": this.address,
                    "to": this.transaction.recipient,
                    "value": parseInt(this.transaction.value),
                    "fee": parseInt(this.transaction.fee) || 10,
                    "dateCreated": new Date().toISOString(),
                    "data": this.data,
                    "senderPubKey": this.publicKey
                };

                this.transactionDataHash = utils.sha256(JSON.stringify(transactionInfo))

                let senderSignature = utils.signData(this.transactionDataHash, this.privateKey);

                this.newTransaction = {
                   ...transactionInfo,
                    "transactionDataHash": this.transactionDataHash,
                    "senderSignature": senderSignature
                }
            },
            isValidSignature(data, publicKey, signature) {
                let keyPair = secp256k1.keyFromPublic(utils.getPublicKeyPoint(publicKey));
                return keyPair.verify(data, {r: signature[0], s: signature[1]});
            },
            async sendTransaction() {
                if (!this.areInputsValid()) {
                    return;
                }

                this.signTransaction();

                if (!this.isValidSignature(this.transactionDataHash,
                                           this.publicKey,
                                           this.newTransaction.senderSignature)) {
                    this.status.error = 'There is a problem in signing the transaction';
                }

                try {
                    await axios.post(this.node + '/transactions/send', this.newTransaction);

                    this.status.error = null;
                    this.status.success = true;
                }
                catch (error) {
                    this.status.error = utils.getErrorMessage(error);
                }
            },
        }
    }
</script>
