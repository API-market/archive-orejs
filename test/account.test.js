/* global WALLET_PASSWORD:true */
/* global ORE_OWNER_ACCOUNT_KEY:true */
/* global ORE_NETWORK_URI:true */
const ecc = require('eosjs-ecc');
const {
  constructOrejs,
  mockGetAccount,
  mockTransaction,
} = require('./helpers/orejs');

describe('account', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('createOreAccount', () => {
    let spyTransaction;
    let spyAccount;
    beforeEach(() => {
      mockGetAccount(orejs);
      mockTransaction(orejs);
      spyTransaction = jest.spyOn(orejs.eos, 'transaction');
      spyAccount = jest.spyOn(orejs.eos, 'getAccount');
    });

    test('returns a new account', async () => {
      const account = await orejs.createOreAccount(WALLET_PASSWORD, ORE_OWNER_ACCOUNT_KEY);
      expect(spyTransaction).toHaveBeenCalledWith(expect.any(Function));
      expect(spyAccount).toHaveBeenCalledWith(expect.any(String));
      expect(account).toEqual({
        authVerifierPublicKey: expect.any(String),
        authVerifierPrivateKey: expect.any(String),
        oreAccountName: expect.stringMatching(/[a-z1-6]{12}/),
        privateKey: expect.any(String),
        publicKey: expect.any(String),
        transaction: expect.any(Function),
      });
      expect(ecc.privateToPublic(orejs.decrypt(account.privateKey, WALLET_PASSWORD))).toEqual(account.publicKey);
      expect(ecc.privateToPublic(orejs.decrypt(account.authVerifierPrivateKey, WALLET_PASSWORD))).toEqual(account.authVerifierPublicKey);
    });
  });
});
