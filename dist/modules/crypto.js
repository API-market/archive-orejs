var CryptoJS = require("crypto-js");
// Decrypts the encrypted eos key with wallet password
function decrypt(encrypted, password) {
    var bytes = CryptoJS.AES.decrypt(encrypted.toString(), password);
    var unencrypted = bytes.toString(CryptoJS.enc.Utf8);
    return unencrypted;
}
// Encrypts the EOS private key with wallet password
function encrypt(unencrypted, password) {
    var encrypted = CryptoJS.AES.encrypt(unencrypted, password);
    return encrypted;
}
module.exports = {
    decrypt: decrypt,
    encrypt: encrypt
};
//# sourceMappingURL=crypto.js.map