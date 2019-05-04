<template>
    <div class="row">
        <div class="s12">
            <ul class="tabs">
                <li class="tab col s3"><a href="#createWalletTab" class="active">Create Wallet</a></li>
                <li class="tab col s3"><a href="#loadWalletTab">Load Wallet</a></li>
                <li class="tab col s3"><a href="#checkBalanceTab">Check Balance</a></li>
                <li class="tab col s3"><a href="#sendTransactionTab">Send Transaction</a></li>
            </ul>
        </div>

        <!-- Create Wallet -->
        <div id="createWalletTab" class="row center-align">
            <div class="row">
                <button class="btn blue center-align" v-on:click.prevent="generateWallet">Create New Wallet</button>
            </div>

            <div class="row">
                <div class="s4-offset s8" v-if="privKey">
                    <p> {{"Your new private Key: " + privKey }} </p>
                    <p> {{"Extracted public Key: " + pubKey }} </p>
                    <p> {{"Extracted address: " + address }} </p>
                </div>
            </div>
        </div>

        <!-- Load Wallet -->
        <div id="loadWalletTab" class="row center-align">
            <div class="row">
                <div class="input-field col offset-s4 s4">
                    <input id="privateKey" type="text" class="validate" name=privateKey v-model="inputPrivateKey">
                    <label for="privateKey">Enter Private Key</label>
                </div>
            </div>
            <div class="row">
                <button class="btn blue center-align" v-on:click.prevent="loadWallet">Load Wallet</button>
            </div>

            <div class="row">
                <div class="s4-offset s8" v-if="enteredPrivateKey">
                    <p> {{"Your private key: " + enteredPrivateKey }} </p>
                    <p> {{"Decoded public Key: " + decodedPublicKey }} </p>
                    <p> {{"Decoded address: " + decodedAddress }} </p>
                </div>
            </div>
        </div>

        <!-- Check Balance -->
        <div id="checkBalanceTab" class="row center-align">
            <form class="col s12" v-on:submit.prevent="loadBalance">
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Address" type="text" class="validate" name=Address>
                        <label for="Address">Enter Address</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Balance-Node" type="text" class="validate" name=Balance-Node>
                        <label for="Balance-Node">Enter Blockchain Node</label>
                    </div>
                </div>
                <div class="row">
                    <button class="btn blue center-align">Check Balance</button>
                </div>
            </form>
        </div>

        <!-- Send Transaction -->
        <div id="sendTransactionTab" class="row center-align">
            <div class="row">
                <div class="input-field col offset-s4 s4">
                    <input id="Sender" type="text" class="validate" name=Sender v-model="sender">
                    <label for="Sender">Enter Sender</label>
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
                <button class="btn blue center-align" v-on:click.prevent="signTransaction">Sign Transaction</button>
            </div>
            <div class="row">
                <div class="input-field col offset-s4 s4">
                    <input id="Node" type="text" class="validate" name=Node v-model="node">
                    <label for="Node">Enter Blockchain Node</label>
                </div>
            </div>
            <div class="row">
                <button class="btn blue center-align" v-on:click.prevent="sendTransaction">Send Transaction</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* label focus color */
   .input-field input[type=text]:focus + label {
     color: #2196f3;
   }

   /* label underline focus color */
   .input-field input[type=text]:focus {
     border-bottom: 1px solid #2196f3;
     box-shadow: 0 1px 0 0 #2196f3;
   }

    .tabs .tab a{
        color:#000;
    } /*Black color to the text*/

    .tabs .tab a:hover {
        background-color:#e3f2fd ;
        color:#000;
    } /*Text color on hover*/

    .tabs .tab a.active {
        background-color:#64b5f6 ;
        color:#fff;
    } /*Background and text color when a tab is active*/

    .tabs .indicator {
        background-color:#64b5f6 ;
    } /*Color of underline*/

    #createWalletForm {
        padding-top: 18vh;
    }
</style>


<script>
    import { log } from 'util';
    const crypto = require('crypto');
    const elliptic = require('elliptic');
    const secp256k1 = elliptic.ec('secp256k1');
    const axios = require('axios');

    export default {
        name: 'WalletPage',
        data() {
            return {
                privKey: null,
                pubKey: null,
                address: null,

                inputPrivateKey: null,
                enteredPrivateKey: null,
                decodedPublicKey: null,
                decodedAddress: null,

                sender: null,
                recipient: null,
                value: null,
                data: null,
                node: null,
                newTransaction: null,
                transactionDataHash: null,
                signedTransaction: null,

            }
        },
        methods: {
            generatePrivateKey() {
                return secp256k1.genKeyPair().getPrivate().toString(16);
            },
            privateKeyToPublicKey(privateKey) {
                let keyPair = secp256k1.keyFromPrivate(privateKey);
                let publicKey = keyPair.getPublic().getX().toString(16);
                publicKey += keyPair.getPublic().getY().isOdd()? '1' : '0';
                return publicKey;
            },
            getPublicKeyPoint(compressedPublicKey) {
                let x = compressedPublicKey.substring(0, 64);
                let y = compressedPublicKey.substring(64);
                return secp256k1.curve.pointFromX(x, parseInt(y));
            },
            sha256(data) {
                return crypto.createHash('sha256').update(data.toString()).digest('hex');
            },
            ripemd160(data) {
                return crypto.createHash('ripemd160').update(data).digest('hex');
            },
            publicKeyToAddress(publicKey) {
                return this.ripemd160(publicKey);
            },
            generateWallet() {
                this.privKey = this.generatePrivateKey();
                this.pubKey  = this.privateKeyToPublicKey(this.privKey);
                this.address = this.publicKeyToAddress(this.pubKey);
            },
            loadWallet() {
                this.enteredPrivateKey = this.inputPrivateKey;
                this.decodedPublicKey  = this.privateKeyToPublicKey(this.enteredPrivateKey);
                this.decodedAddress = this.publicKeyToAddress(this.decodedPublicKey);
            },
            signData(data, privKey) {
                let keyPair = secp256k1.keyFromPrivate(privKey);
                let signature = keyPair.sign(data);

                return [
                    signature.r.toString(16),
                    signature.s.toString(16)
                ];
            },
            decompressPublicKey(compressedPublicKey) {
                let x = compressedPublicKey.substring(0, 64);
                let y = compressedPublicKey.substring(64);
                return secp256k1.curve.pointFromX(x, parseInt(y));
            },
            isValidSignature(data, publicKey, signature) {
                let keyPair = secp256k1.keyFromPublic(this.getPublicKeyPoint(publicKey));
                return keyPair.verify(data, {r: signature[0], s: signature[1]});
            },
            signTransaction() {
                console.log('Sign Transaction');
                const transactionInfo = {
                    "from": this.sender,
                    "to": this.recipient,
                    "value": parseInt(this.value),
                    "fee": 10,
                    "dateCreated": new Date().toISOString(),
                    "data": "",
                    "senderPubKey": this.decodedPublicKey
                }

                this.transactionDataHash = this.sha256(JSON.stringify(transactionInfo))

                const senderSignature = this.signData(this.transactionDataHash, this.enteredPrivateKey);

                this.newTransaction = {
                   ...transactionInfo,
                    "transactionDataHash": this.transactionDataHash,
                    "senderSignature": senderSignature
                }

                console.log(this.newTransaction);

            },
            sendTransaction() {
                console.log('Sending Transction');
                console.log(this.newTransaction);

                if (!this.isValidSignature(this.transactionDataHash,
                                           this.decodedPublicKey,
                                           this.newTransaction.senderSignature)) {
                    console.log('Invalid Signature in Created Transaction.');
                    return;
                }

                console.log("Transaction verified");


                axios.post(this.node + '/transactions/send', this.newTransaction)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });

            }
        }
    }
</script>