<template>
    <div id="loadWalletTab" class="row center-align">

        <div class="row">
            <div class="col offset-s3 s6">
                <div class="card">
                    <div class="card-content">
                        <table class="highlight">
                            <tbody>
                                <tr>
                                    <td><b>Private Key</b></td>
                                    <td><i>{{ privateKey }}</i></td>
                                </tr>
                                <tr>
                                    <td><b>Public Key</b></td>
                                    <td><i>{{ publicKey }}</i></td>
                                </tr>
                                <tr>
                                    <td><b>Address</b></td>
                                    <td><i>{{ address }}</i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="input-field col offset-s3 s6">
                <input id="privateKey" type="text" class="validate" name=privateKey v-model="inputPrivateKey">
                <label for="privateKey">Enter Private Key</label>
            </div>
        </div>

        <div class="row">
            <button class="btn-large blue center-align waves-effect waves-light" v-on:click.prevent="loadWallet">
                Load Existing Wallet
            </button>
            <p v-if="status.success" class="green-text dark-accent-4">Wallet Successfully Loaded!</p>
            <p v-else-if="status.error !== null" class="red-text darken-4">{{status.error}}</p>
        </div>

    </div>
</template>

<style scoped>
    #loadWalletTab {
        padding-top: 15vh;
    }
</style>

<script>
    const crypto = require('crypto');
    const elliptic = require('elliptic');
    const secp256k1 = elliptic.ec('secp256k1');

    export default {
        data() {
            return {
                status: {
                    error: null,
                    success: false,
                },
                inputPrivateKey: null || window.localStorage.getItem('privKey'),
                privateKey: null || window.localStorage.getItem('privKey'),
                publicKey: null || window.localStorage.getItem('pubKey'),
                address: null || window.localStorage.getItem('address'),
            }
        },
        mounted() {
            $(document).ready(function() {
                M.updateTextFields();
            });
        },
        methods: {
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
            isValidPrivateKey(key) {
                if(typeof key !== 'string') return false;
                if(key.length !== 64) return false;
                return this.isHexString(key);
            },
             isHexString(hex) {
                return /^[0-9a-f]+$/.test(hex);
            },
            loadWallet() {
                if (!this.isValidPrivateKey(this.inputPrivateKey)) {
                    this.status.error = 'Please Input a Valid Private Key';
                    return;
                }

                this.privateKey = this.inputPrivateKey;
                this.publicKey  = this.privateKeyToPublicKey(this.privateKey);
                this.address = this.publicKeyToAddress(this.publicKey);

                window.localStorage.setItem('privKey', this.privateKey);
                window.localStorage.setItem('pubKey', this.publicKey);
                window.localStorage.setItem('address', this.address);

                this.status.success = true;
                this.$emit('loadWallet');
            },
        }
    }
</script>
