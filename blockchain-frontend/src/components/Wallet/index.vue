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
            <form id="createWalletForm" class="col s12" v-on:submit.prevent="generateWallet">
                <div class="row">
                    <button class="btn blue center-align">Create New Wallet</button>
                </div>
            </form>

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
            <form id="loadWalletForm" class="col s12" v-on:submit.prevent="loadWallet">
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="privateKey" type="text" class="validate" name=privateKey v-model="inputPrivateKey">
                        <label for="privateKey">Enter Private Key</label>
                    </div>
                </div>
                <div class="row">
                    <button class="btn blue center-align">Load Wallet</button>
                </div>
            </form>

            <div class="row">
                <div class="s4-offset s8" v-if="walletLoaded === true">
                    <p> {{"Your private key: " + enteredPrivateKey }} </p>
                    <p> {{"Decoded public Key: " + decodedPublicKey }} </p>
                    <p> {{"Decoded address: " + decodedAddress }} </p>
                </div>
            </div>
        </div>

        <!-- <div id="checkBalanceTab" class="row center-align">
            <form class="col s12" v-on:submit.prevent="loadBalance">
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Address" type="text" class="validate" name=Address>
                        <label for="Address">Enter Address</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Node" type="text" class="validate" name=Node>
                        <label for="Node">Enter Blockchain Node</label>
                    </div>
                </div>
                <div class="row">
                    <button class="btn blue center-align">Check Balance</button>
                </div>
            </form>
        </div> -->

        <!-- <div id="sendTransactionTab" class="row center-align">
            <form class="col s12" v-on:submit.prevent="loadBalance">
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Sender" type="text" class="validate" name=Sender>
                        <label for="Sender">Enter Sender</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Recipient" type="text" class="validate" name=Recipient>
                        <label for="Recipient">Enter Recipient</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Value" type="text" class="validate" name=Value>
                        <label for="Value">Enter Value</label>
                    </div>
                </div>
                <div class="row">
                    <button class="btn blue center-align">Sign Transaction</button>
                </div>
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Node" type="text" class="validate" name=Node>
                        <label for="Node">Enter Blockchain Node</label>
                    </div>
                </div>
                <div class="row">
                    <button class="btn blue center-align">Send Transaction</button>
                </div>
            </form>
        </div> -->
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

    export default {
        name: 'WalletPage',
        data() {
            return {
                passphrase: null,
                privKey: null,
                pubKey: null,
                address: null,
                inputPrivateKey: null,
                enteredPrivateKey: null,
                decodedPublicKey: null,
                decodedAddress: null,
                walletLoaded: false
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
                this.walletLoaded = true;
                console.log('Wallet Loaded');

            }
        }
    }
</script>