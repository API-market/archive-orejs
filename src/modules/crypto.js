const sjcl = require('sjcl');

// Decrypts the encrypted eos key with wallet password
function decrypt(encrypted, key) {
  try {
    const encryptedData = JSON.stringify(Object.assign(JSON.parse(encrypted), { mode: 'gcm' }));
    return sjcl.decrypt(key, encryptedData);
  } catch (err) {
    console.error('Decryption Error:', err);
    return '';
  }
}

// Encrypts the EOS private key with wallet password
function encrypt(unencrypted, key) {
  const { iv, salt, ct } = JSON.parse(sjcl.encrypt(key, unencrypted, { mode: 'gcm' }));
  return JSON.stringify({ iv, salt, ct });
}

module.exports = {
  decrypt,
  encrypt,
};
