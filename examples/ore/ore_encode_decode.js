const fs = require('fs');
const { crypto, walletPassword } = require('../index');

const USER = 'test2.apim';
(async function () {
  const account = process.env.ORE_OWNER_ACCOUNT_NAME;
  const privateKey = process.env.ORE_OWNER_ACCOUNT_KEY;
  console.log('Account:', account);

  const encryptedKey = crypto.encrypt(privateKey, walletPassword).toString();
  console.log('Encrypted Key:', encryptedKey);

  const decryptedKey = crypto.decrypt(encryptedKey, walletPassword).toString();
  console.log('Decrypted Key Matches:', decryptedKey == privateKey);
}());
