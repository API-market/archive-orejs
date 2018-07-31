const CryptoJS = require('crypto-js');

// Decrypts the encrypted eos key with wallet password
function decrypt(encrypted, password) {
  const bytes = CryptoJS.AES.decrypt(encrypted.toString(), password);
  const unencrypted = bytes.toString(CryptoJS.enc.Utf8);

  return unencrypted;
}

// Encrypts the EOS private key with wallet password
function encrypt(unencrypted, password) {
  const encrypted = CryptoJS.AES.encrypt(unencrypted, password);

  return encrypted;
}

module.exports = {
  decrypt,
  encrypt,
};
