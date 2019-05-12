const crypto = require('crypto');
const elliptic = require('elliptic');
const secp256k1 = elliptic.ec('secp256k1');

export default {
    test() {
        alert('Hello World!');
    },
    getErrorMessage(error) {
        let response = error.response || {};
        let data = response.data || {};
        return data.errorMsg || data.message || error.message || 'An unknown error occurred.';
    },
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
        let keyPair = secp256k1.keyFromPrivate(privateKey);
        let publicKey = keyPair.getPublic().getX().toString(16);
        publicKey += keyPair.getPublic().getY().isOdd()? '1' : '0';
        return publicKey;
    },
    publicKeyToAddress(publicKey) {
        return this.ripemd160(publicKey);
    },
    isValidPrivateKey(key) {
        if(typeof key !== 'string') return false;
        return this.isHexString(key);
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
    getPublicKeyPoint(compressedPublicKey) {
        let x = compressedPublicKey.substring(0, 64);
        let y = compressedPublicKey.substring(64);
        return secp256k1.curve.pointFromX(x, parseInt(y));
    },
    signData(data, privateKey) {
        let keyPair = secp256k1.keyFromPrivate(privateKey);
        let signature = keyPair.sign(data);
        return [signature.r.toString(16), signature.s.toString(16)];
    }

};