const ecc = require('eosjs-ecc');
const {
  expectFetch,
  mockAccount
} = require('./helpers/fetch');
const {
  constructOrejs,
  mockTransaction
} = require('./helpers/orejs');

describe('account', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('createOreAccount', () => {
    let spy;
    let transaction;
    beforeEach(() => {
      transaction = mockTransaction();
      spy = jest.spyOn(orejs.eos, 'transaction');
    });

    test('returns a new account', async () => {
      const account = await orejs.createOreAccount(WALLET_PASSWORD, ORE_OWNER_ACCOUNT_KEY);
      expect(spy).toHaveBeenCalledWith(expect.any(Function));
      expect(account).toEqual({
        oreAccountName: expect.stringMatching(/[a-z1-6]{12}/),
        privateKey: expect.any(String),
        publicKey: expect.any(String),
        transaction: expect.any(Function),
      });
      expect(ecc.privateToPublic(orejs.decrypt(account.privateKey, WALLET_PASSWORD))).toEqual(account.publicKey);
    });
  });

  describe('getOreAccountContents', () => {
    let account;

    beforeEach(() => {
      account = mockAccount();

      fetch.resetMocks();
      fetch.mockResponses(account);
    });

    test('returns the account contents', async () => {
      const accountContents = await orejs.getOreAccountContents('y4dcmrzgiyte');
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_account`);
      expect(JSON.stringify(accountContents)).toEqual(account[0]);
    });
  });
});