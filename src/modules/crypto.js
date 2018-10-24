const sjcl = require('sjcl');

// Derive the key used for encryption/decryption
function deriveKey(password, salt) {
  // NOTE Passing in at least an empty string for the salt, will prevent cached keys, which can lead to false positives in the test suite
  const { key } = sjcl.misc.cachedPbkdf2(password, { iter: 1000, salt: salt || '' });
  return key;
}

// Decrypts the encrypted EOS key with wallet password
function decrypt(encrypted, password, salt) {
  try {
    const encryptedData = JSON.stringify(Object.assign(JSON.parse(encrypted), { mode: 'gcm' }));
    return sjcl.decrypt(deriveKey(password, salt), encryptedData);
  } catch (err) {
    // console.error('Decryption Error:', err);
    return '';
  }
}

// Encrypts the EOS private key with wallet password
function encrypt(unencrypted, password, salt) {
  const p = { iter: 1000, salt };
  const { key } = sjcl.misc.cachedPbkdf2(password, { iter: 1000, salt });
  const encrypted = JSON.parse(sjcl.encrypt(deriveKey(password, salt), unencrypted, { mode: 'gcm' }));
  return JSON.stringify(encrypted);
}

module.exports = {
  decrypt,
  deriveKey,
  encrypt,
};
