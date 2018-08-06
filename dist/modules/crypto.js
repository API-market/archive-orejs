var CryptoJS = require('crypto-js');
// Decrypts the encrypted eos key with wallet password
function decrypt(encrypted, password) {
    var bytes = CryptoJS.AES.decrypt(encrypted.toString(), password);
    try {
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    catch (err) {
        // NOTE Sometimes the CryptoJS lib fails to convert array buffers to UTF-8 strings, when decrypted with an incorrect password
        console.error('CryptoJS Decryption Error:', err);
        return '';
    }
}
// Encrypts the EOS private key with wallet password
function encrypt(unencrypted, password) {
    return CryptoJS.AES.encrypt(unencrypted, password);
}
module.exports = {
    decrypt: decrypt,
    encrypt: encrypt,
};
//# sourceMappingURL=crypto.js.map