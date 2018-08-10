/* global ORE_TESTA_ACCOUNT_NAME:true */
/* global ORE_NETWORK_URI:true */
const {
  expectFetch,
  mockBlock,
  mockInfo,
} = require('./helpers/fetch');
const {
  constructOrejs,
} = require('./helpers/orejs');

describe('token', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('getLatestBlock', () => {
    let block;

    beforeEach(() => {
      block = mockBlock();

      fetch.resetMocks();
      fetch.mockResponses(mockInfo(), block);
    });

    test('returns the latest block', async () => {
      const blockNum = await orejs.getLatestBlock();
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_info`, `${ORE_NETWORK_URI}/v1/chain/get_block`);
      expect(JSON.stringify(blockNum)).toEqual(block[0]);
    });
  });

  describe('hasTransaction', () => {
    let block;
    let transactionId;
    let transaction;

    beforeAll(() => {
      transactionId = 'asdf';
      transaction = {
        trx: {
          id: transactionId,
        },
      };
    });

    describe('when the block includes the transaction', () => {
      beforeAll(() => {
        block = {
          transactions: [transaction],
        };
      });

      test('returns true', () => {
        const hasTransaction = orejs.hasTransaction(block, transactionId);
        expect(hasTransaction).toEqual(true);
      });
    });

    describe('when the block does not include the transaction', () => {
      beforeAll(() => {
        block = {
          transactions: [],
        };
      });

      test('returns false', () => {
        const hasTransaction = orejs.hasTransaction(block, transactionId);
        expect(hasTransaction).toEqual(false);
      });
    });
  });

  describe('tableKey', () => {
    let encodedAccountName;

    beforeAll(() => {
      encodedAccountName = orejs.tableKey(ORE_TESTA_ACCOUNT_NAME);
    });

    test('returns a number', () => {
      expect(encodedAccountName.toString()).toEqual('14605613949550624768');
    });

    test('returns a BigNumber', () => {
      expect(encodedAccountName.plus(1).toString()).toEqual('14605613949550624769');
    });
  });
});
