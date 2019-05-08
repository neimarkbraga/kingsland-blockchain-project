<template>
    <div id="sendTransactionTab" class="row center-align">
        <div class="row">
            <div class="col offset-s4 s6">
                <span class="left">
                    <h5>
                        Loaded Wallet Address:
                    <i>
                        {{ loadedAddress }}
                    </i>
                    </h5>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="input-field col offset-s4 s4">
                <input id="Recipient" type="text" class="validate" name=Recipient v-model="recipient">
                <label for="Recipient">Enter Recipient</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col offset-s4 s4">
                <input id="Value" type="text" class="validate" name=Value v-model="value">
                <label for="Value">Enter Value</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col offset-s4 s4">
                <input id="Data" type="text" class="validate" name=Data v-model="data">
                <label for="Data">Enter Data (optional)</label>
            </div>
        </div>
        <div class="row">
            <button class="btn-large blue center-align" v-on:click.prevent="signTransaction">Sign Transaction</button>
            <p v-if="status.error">{{status.error}}</p>
        </div>
        <div class="row">
            <div class="input-field col offset-s4 s4">
                <input id="Node" type="text" class="validate" name=Node v-model="node">
                <label for="Node">Enter Blockchain Node</label>
            </div>
        </div>
        <div class="row">
            <button class="btn-large blue center-align" v-on:click.prevent="sendTransaction">Send Transaction</button>
        </div>
    </div>
</template>

<style scoped>

</style>


<script>
    const axios = require('axios');
    const crypto = require('crypto');
    const elliptic = require('elliptic');
    const secp256k1 = elliptic.ec('secp256k1');

    export default {
        data() {
            return {
                status: {
                    error: null
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
            signTransaction() {
                if (!this.loadedPrivKey) {
                    this.status.error = 'Please Load a Wallet First';
                    return;
                }

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
                if (!this.isValidSignature(this.transactionDataHash,
                                           this.loadedPubKey,
                                           this.newTransaction.senderSignature)) {
                    return;
                }

                try {
                    const response = axios.post(this.node + '/transactions/send', this.newTransaction);
                    window.localStorage.clear();
                    console.log(response);
                    // Notify Successful Tx Sending
                    // with corresponding Tx Hash
                }
                catch (error) {
                    console.log(error);
                    // Notify Erroneuos Tx Sending
                    // with corresponding Error Msg
                }
            },
        }
    }
</script>
