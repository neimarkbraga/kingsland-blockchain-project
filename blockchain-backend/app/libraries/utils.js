const crypto = require('crypto');
const elliptic = require('elliptic');
const secp256k1 = elliptic.ec('secp256k1');

module.exports = {
    sha256(data) {
        return crypto.createHash('sha256')
                     .update(data.toString())
                     .digest('hex');
    },
    ripemd160(data) {
        return crypto.createHash('ripemd160').update(data).digest('hex');
    },
    generatePrivateKey() {
        return secp256k1.genKeyPair().getPrivate().toString(16);
    },
    privateKeyToPublicKey(privateKey) {
        // let ecdh = crypto.createECDH('secp256k1');
        // ecdh.setPrivateKey(privateKey, 'hex');
        // let x = ecdh.getPublicKey('hex').substr(2, 64);
        // let y = parseInt(ecdh.getPublicKey('hex').substr(-1), 16);

        let keyPair = secp256k1.keyFromPrivate(privateKey);
        let publicKey = keyPair.getPublic().getX().toString(16);
        publicKey += keyPair.getPublic().getY().isOdd()? '1' : '0';
        return publicKey;
    },
    publicKeyToAddress(publicKey) {
        return this.ripemd160(publicKey);
    }
};