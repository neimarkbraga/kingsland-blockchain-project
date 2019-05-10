<template>
    <div id="sendTransactionTab" class="row center-align">
        <div class="row">
            <div class="col offset-s3 s6">
                <span class="left">
                    <h5>
                        Loaded Wallet Address: <i>{{ loadedAddress }}</i>
                    </h5>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="input-field col offset-s3 s4">
                <input id="Recipient" type="text" class="validate" name=Recipient v-model="recipient">
                <label for="Recipient">Enter Recipient</label>
            </div>
            <div class="input-field col s2">
                <input id="Value" type="text" class="validate" name=Value v-model="value">
                <label for="Value">Enter Value</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col offset-s3 s4">
                <input id="Data" type="text" class="validate" name=Data v-model="data">
                <label for="Data">Enter Data (optional)</label>
            </div>
            <div class="input-field col s2">
                <input id="Node" type="text" class="validate" name=Node v-model="node">
                <label for="Node">Enter Blockchain Node</label>
            </div>
        </div>
        <div class="row">
            <button class="btn-large blue center-align" v-on:click.prevent="sendTransaction">Send Transaction</button>
        </div>
        <p v-if="status.error !== null" class="red-text darken-4">{{status.error}}</p>
        <div v-else-if="status.success === true" class="green-text accent-4">
            <h5>Transaction Sent!</h5>
            <p><b>Transaction Hash:</b> <i>{{transactionDataHash}}</i></p>
        </div>
    </div>
</template>

<style scoped>
    #sendTransactionTab {
        margin-top: 7vh;
    }
</style>


<script>
    const axios = require('axios');
    const crypto = require('crypto');
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

                recipient: null,
                value: null,
                data: null,
                node: null,
                newTransaction: null,
                transactionDataHash: null,
                signedTransaction: null,
            }
        },
        props: [
            'loadedPrivKey',
            'loadedPubKey',
            'loadedAddress'
        ],
        methods: {
            sha256(data) {
                return crypto.createHash('sha256').update(data.toString()).digest('hex');
            },
            signData(data, privKey) {
                let keyPair = secp256k1.keyFromPrivate(privKey);
                let signature = keyPair.sign(data);

                return [
                    signature.r.toString(16),
                    signature.s.toString(16)
                ];
            },
            areInputsValid() {
                if (!this.loadedPrivKey) {
                    this.status.error = 'Please Load a Wallet First';
                    return false;
                }

                if (!this.recipient) {
                    this.status.error = 'Please enter a recipient';
                    return false;
                }

                if (!this.value) {
                    this.status.error = 'Please enter an amount to send';
                    return false;
                }

                if (!this.node) {
                    this.status.error = 'Please enter a node';
                    return false;
                }

                return true;
            },
            signTransaction() {
                const transactionInfo = {
                    "from": this.loadedAddress,
                    "to": this.recipient,
                    "value": parseInt(this.value),
                    "fee": 10,
                    "dateCreated": new Date().toISOString(),
                    "data": "",
                    "senderPubKey": this.loadedPubKey
                }

                this.transactionDataHash = this.sha256(JSON.stringify(transactionInfo))

                const senderSignature = this.signData(this.transactionDataHash, this.loadedPrivKey);

                this.newTransaction = {
                   ...transactionInfo,
                    "transactionDataHash": this.transactionDataHash,
                    "senderSignature": senderSignature
                }

                //Notify Data Signed
            },
            getPublicKeyPoint(compressedPublicKey) {
                let x = compressedPublicKey.substring(0, 64);
                let y = compressedPublicKey.substring(64);
                return secp256k1.curve.pointFromX(x, parseInt(y));
            },
            isValidSignature(data, publicKey, signature) {
                let keyPair = secp256k1.keyFromPublic(this.getPublicKeyPoint(publicKey));
                return keyPair.verify(data, {r: signature[0], s: signature[1]});
            },
            async sendTransaction() {
                if (!this.areInputsValid()) {
                    return;
                }

                this.signTransaction();

                if (!this.isValidSignature(this.transactionDataHash,
                                           this.loadedPubKey,
                                           this.newTransaction.senderSignature)) {
                    this.status.error = 'There is a problem in signing the transaction';
                }

                try {
                    await axios.post(this.node + '/transactions/send', this.newTransaction);
                    window.localStorage.clear();

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
