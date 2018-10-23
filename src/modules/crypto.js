const sjcl = require('sjcl');

// Decrypts the encrypted eos key with wallet password
function decrypt(encrypted, password, salt) {
  try {
    const p = { iter: 1000, salt };
    const { key } = sjcl.misc.cachedPbkdf2(password, { iter: 1000, salt: salt || '' });
    const encryptedData = JSON.stringify(Object.assign(JSON.parse(encrypted), { mode: 'gcm' }));
    return sjcl.decrypt(key.toString(), encryptedData);
  } catch (err) {
    // console.error('Decryption Error:', err);
    return '';
  }
}

// Encrypts the EOS private key with wallet password
function encrypt(unencrypted, password, salt) {
  const p = { iter: 1000, salt };
  const { key } = sjcl.misc.cachedPbkdf2(password, { iter: 1000, salt });
  const encrypted = JSON.parse(sjcl.encrypt(key.toString(), unencrypted, { mode: 'gcm' }));
  return JSON.stringify(encrypted);
}

module.exports = {
  decrypt,
  encrypt,
};
