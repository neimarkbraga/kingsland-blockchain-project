<template>
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
    </div>
</template>

<style scoped>
    #loadWalletTab {
        padding-top: 18vh;
    }
</style>

<script>
    const crypto = require('crypto');
    const elliptic = require('elliptic');
    const secp256k1 = elliptic.ec('secp256k1');

    export default {
        data() {
            return {
                inputPrivateKey: null,
                privateKey: null,
                publicKey: null,
                address: null,
            }
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
            loadWallet() {
                this.privateKey = this.inputPrivateKey;
                this.publicKey  = this.privateKeyToPublicKey(this.privateKey);
                this.address = this.publicKeyToAddress(this.publicKey);

                window.localStorage.setItem('privKey', this.privateKey);
                window.localStorage.setItem('pubKey', this.publicKey);
                window.localStorage.setItem('address', this.address);

                this.$emit('loadWallet');
            },
        }
    }
</script>
