/* global ORE_TESTA_ACCOUNT_NAME:true */
/* global ORE_NETWORK_URI:true */
const {
  expectFetch,
  mockBlock,
  mockInfo,
} = require('./helpers/fetch');
const {
  constructOrejs,
  mockGetAccount,
  mockGetInfo,
  mockGetBlock,
  mockGetTransaction,
} = require('./helpers/orejs');

describe('token', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('getHeadBlock', () => {
    let block;

    beforeEach(() => {
      block = mockBlock();

      fetch.resetMocks();
      fetch.mockResponses(mockInfo(), block);
    });

    test('returns the latest block', async () => {
      const blockNum = await orejs.getHeadBlock();
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_info`, `${ORE_NETWORK_URI}/v1/chain/get_block`);
      expect(JSON.stringify(blockNum)).toEqual(block[0]);
    });
  });

  describe('awaitTransaction', () => {
    let transaction;
    let info;
    let block;
    let spyInfo;
    let spyBlock;
    beforeAll(() => {
      transaction = mockGetTransaction(orejs);
      info = mockGetInfo(orejs);
      block = mockGetBlock(orejs, { block_num: info.head_block_num, transactions: [{ trx: { id: transaction.transaction_id } }] });
      spyInfo = jest.spyOn(orejs.eos, 'getInfo');
      spyBlock = jest.spyOn(orejs.eos, 'getBlock');
    });

    test('returns the transaction', async () => {
      await orejs.awaitTransaction(async () => {
        await setTimeout(() => true, 10);
        return transaction;
      }, 10, 10);
      expect(spyInfo).toHaveBeenCalledWith({});
      expect(spyBlock).toHaveBeenCalledWith(block.block_num);
    });

    describe('when the transaction is not found', () => {
      beforeAll(() => {
        jest.clearAllMocks();
        transaction = mockGetTransaction(orejs);
        info = mockGetInfo(orejs);
        block = mockGetBlock(orejs, { block_num: info.head_block_num, transactions: [{ trx: { id: transaction.transaction_id + 1 } }] });
      });

      test('throws an error with the block number', async () => {
        const result = orejs.awaitTransaction(async () => {
          await setTimeout(() => true, 10);
          return transaction;
        }, 2, 10);
        expect(result).rejects.toThrow();
      });
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
