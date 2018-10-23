/* global ORE_TESTA_ACCOUNT_KEY:true */
/* global WALLET_PASSWORD:true */
/* global SALT:true */

const {
  crypto,
} = require('../../src');

describe('encryption/decryption of private keys with wallet passwords', () => {
  let privateKey;
  let salt;
  let walletPassword;
  let encrypted;

  beforeAll(() => {
    privateKey = ORE_TESTA_ACCOUNT_KEY;
    salt = SALT;
    walletPassword = WALLET_PASSWORD;
    encrypted = crypto.encrypt(privateKey, walletPassword, salt);
  });

  test('returns an encrypted string', () => {
    expect(encrypted.toString()).toEqual(expect.not.stringContaining(privateKey));
  });

  test('returns the original privateKey', () => {
    const decrypted = crypto.decrypt(encrypted, walletPassword, salt);
    expect(decrypted.toString()).toMatch(privateKey);
  });

  test('does not return privateKey with a bad password', () => {
    const badPassword = 'BadPassword';
    const decrypted = crypto.decrypt(encrypted, badPassword, salt);
    expect(decrypted.toString()).not.toMatch(privateKey);
  });

  test('does not return privateKey with a bad salt', () => {
    const badPassword = 'BadPassword';
    const decrypted = crypto.decrypt(encrypted, walletPassword, '');
    expect(decrypted.toString()).not.toMatch(privateKey);
  });
});
