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
    },
    isValidPublicKey(key) {
        if(typeof key !== 'string') return false;
        if(key.length !== 65) return false;
        return this.isHexString(key);
    },
    isValidAddress(address) {
        if(typeof address !== 'string') return false;
        if(address.length !== 40) return false;
        return this.isHexString(address);
    },
    isHexString(hex) {
        return /^[0-9a-f]+$/.test(hex);
    },
    isISO8601Date(date) {
        if(typeof date !== 'string') return false;
        return /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/.test(date);
    },
    isValidSignature(data, publicKey, signature) {
        let keyPair = secp256k1.keyFromPublic(this.getPublicKeyPoint(publicKey));
        return keyPair.verify(data, {r: signature[0], s: signature[1]});
    },
    getPublicKeyPoint(compressedPublicKey) {
        let x = compressedPublicKey.substring(0, 64);
        let y = compressedPublicKey.substring(64);
        return secp256k1.curve.pointFromX(x, parseInt(y));
    },
    createDifficultyStr(difficulty) {
        let diffStr = '';
        for (let i = 0; i < difficulty; i++)
        {
            diffStr += '0';
        }
        return diffStr;
    }
};
