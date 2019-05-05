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
                <div class="col s12">
                    <button class="btn-large blue center-align" v-on:click.prevent="generateWallet">Create New Wallet</button>
                </div>
            </div>

            <div class="row">
                <div class="col offset-s3 s6">
                    <div class="card">
                        <div class="card-content">
                            <table class="highlight">
                                <tbody>
                                    <tr>
                                        <td><b>Private Key</b></td>
                                        <td>{{ privKey }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Public Key</b></td>
                                        <td>{{ pubKey }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Address</b></td>
                                        <td>{{ address }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                <button class="btn-large blue center-align" v-on:click.prevent="loadWallet">Load Existing Wallet</button>
            </div>

            <div class="row">
                <div class="col offset-s3 s6">
                    <div class="card">
                        <div class="card-content">
                            <table class="highlight">
                                <tbody>
                                    <tr>
                                        <td><b>Private Key</b></td>
                                        <td>{{ enteredPrivateKey }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Public Key</b></td>
                                        <td>{{ decodedPublicKey }}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Address</b></td>
                                        <td>{{ decodedAddress }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Check Balance -->
        <div id="checkBalanceTab" class="row center-align">
            <form class="col s12" v-on:submit.prevent="loadBalance">
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Address" type="text" class="validate" name=Address v-model="balanceAddress">
                        <label for="Address">Enter Address</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col offset-s4 s4">
                        <input id="Balance-Node" type="text" class="validate" name=Balance-Node v-model="balanceNode">
                        <label for="Balance-Node">Enter Blockchain Node</label>
                    </div>
                </div>
                <div class="row">
                    <button class="btn-large blue center-align">Check Balance</button>
                </div>

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
                <button class="btn-large blue center-align" v-on:click.prevent="signTransaction">Sign Transaction</button>
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

    #createWalletTab {
        padding-top: 20vh;
    }

    #checkBalanceTab {
        padding-top: 15vh;
    }

    #loadWalletTab {
        padding-top: 18vh;
    }

    #sendTransactionTab {
        padding-top: 7vh;
    }

</style>


<script>
    const crypto = require('crypto');
    const elliptic = require('elliptic');
    const secp256k1 = elliptic.ec('secp256k1');
    const axios = require('axios');

    export default {
        name: 'WalletPage',
        data() {
            return {
                // Create Wallet
                privKey: null,
                pubKey: null,
                address: null,

                // Load Wallet
                inputPrivateKey: null,
                enteredPrivateKey: null,
                decodedPublicKey: null,
                decodedAddress: null,

                // Check Balance
                balanceAddress: null,
                balanceNode: null,
                balance: null,

                // Send Transaction
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
            async loadBalance() {
                try {
                    const response = await axios.get(this.balanceNode + '/address/' + this.balanceAddress + '/balance');
                    this.balance = response.data;
                }
                catch (error) {
                    console.log(error);
                }

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
            },
            async sendTransaction() {
                if (!this.isValidSignature(this.transactionDataHash,
                                           this.decodedPublicKey,
                                           this.newTransaction.senderSignature)) {
                    return;
                }

                try {
                    const response = axios.post(this.node + '/transactions/send', this.newTransaction)
                    console.log(response);
                }
                catch (error) {
                    console.log(error);
                };

            }
        },
        mounted() {
            $('.tabs').tabs();
        }
    }
</script>