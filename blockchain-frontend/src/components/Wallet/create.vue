<template>
    <div id="createWalletTab" class="row center-align">

        <div class="row">
            <div class="col offset-s3 s6">
                <div class="card">
                    <div class="card-content">
                        <table class="highlight">
                            <tbody>
                                <tr>
                                    <td><b>Private Key</b></td>
                                    <td><i>{{ privKey }}</i></td>
                                </tr>
                                <tr>
                                    <td><b>Public Key</b></td>
                                    <td><i>{{ pubKey }}</i></td>
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
            <div class="col s12">
                <button class="btn-large blue center-align" v-on:click.prevent="generateWallet">Create New Wallet</button>
            </div>
        </div>
        <p v-if="this.privKey" class="green-text dark-accent-4">Please store your private key in a secure place.</p>

    </div>
</template>

<style scoped>
    #createWalletTab {
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
                privKey: null,
                pubKey: null,
                address: null,
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
        }
}
</script>
