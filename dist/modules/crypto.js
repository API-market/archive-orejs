var sjcl = require('sjcl');
// Decrypts the encrypted eos key with wallet password
function decrypt(encrypted, key) {
    try {
        var encryptedData = JSON.stringify(Object.assign(JSON.parse(encrypted), { mode: 'gcm' }));
        return sjcl.decrypt(key, encryptedData);
    }
    catch (err) {
        console.error('Decryption Error:', err);
        return '';
    }
}
// Encrypts the EOS private key with wallet password
function encrypt(unencrypted, key) {
    var _a = JSON.parse(sjcl.encrypt(key, unencrypted, { mode: 'gcm' })), iv = _a.iv, salt = _a.salt, ct = _a.ct;
    return JSON.stringify({ iv: iv, salt: salt, ct: ct });
}
module.exports = {
    decrypt: decrypt,
    encrypt: encrypt,
};
//# sourceMappingURL=crypto.js.map