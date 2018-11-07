/* global ORE_NETWORK_URI:true */
/* global ORE_OWNER_ACCOUNT_NAME:true */
/* global ORE_TESTA_ACCOUNT_NAME:true */
const {
  expectFetch,
  mock,
  mockInfo,
} = require('../helpers/fetch');

const {
  mockAction,
  mockOptions,
} = require('../helpers/eos');

const {
  constructOrejs,
  mockGetBlock,
  mockGetInfo,
  mockGetTransaction,
} = require('../helpers/orejs');

describe('ore', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('getOreBalance', () => {
    let oreBalance;

    beforeEach(() => {
      oreBalance = 30;

      fetch.resetMocks();
      fetch.mockResponses(mock([`${oreBalance}.0000 ORE`]));
      orejs = constructOrejs({ fetch });
    });

    it('returns the ore balance', async () => {
      oreBalance = await orejs.getOreBalance(ORE_TESTA_ACCOUNT_NAME);
      expect(oreBalance).toEqual(oreBalance);
    });
  });

  describe('approveOre', () => {
    let oreBalance;
    let memo;
    let spyTransaction;
    let transaction;

    beforeEach(() => {
      oreBalance = 10;
      memo = 'approve ORE transfer';
      fetch.resetMocks();
      fetch.mockResponses(mock([`${oreBalance}.0000 ORE`]));
      orejs = constructOrejs({ fetch });
      transaction = mockGetTransaction(orejs);
      spyTransaction = jest.spyOn(orejs.eos, 'transact');
    });

    describe('when authorized', () => {
      it('returns', async () => {
        mockGetInfo(orejs);
        mockGetBlock(orejs);
        const result = await orejs.approveOre(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance, memo);
        expect(spyTransaction).toHaveBeenCalledWith({ actions: [mockAction({ account: 'token.ore', name: 'approve' })] }, mockOptions());
      });
    });

    describe('when unauthorized', () => {
      xit('throws', () => {
        mockGetInfo(orejs);
        mockGetBlock(orejs);
        contract.approve.mockImplementationOnce(() => Promise.reject(new Error('unauthorized')));

        const result = orejs.approveOre(ORE_TESTA_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance);
        expect(result).rejects.toThrow(/unauthorized/);
      });
    });
  });

  describe('transferOre', () => {
    let oreBalance;
    let spyTransaction;
    let transaction;

    beforeEach(() => {
      oreBalance = 10;
      transaction = mockGetTransaction(orejs);
      spyTransaction = jest.spyOn(orejs.eos, 'transact');
    });

    describe('when authorized', () => {
      it('returns', async () => {
        const result = await orejs.transferOre(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance);
        expect(spyTransaction).toHaveBeenCalledWith({ actions: [mockAction({ account: 'token.ore', name: 'transfer' })] }, mockOptions());
      });
    });

    describe('when unauthorized', () => {
      xit('throws', () => {
        mockGetInfo(orejs);
        mockGetBlock(orejs);
        contract.approve.mockImplementationOnce(() => Promise.reject(new Error('unauthorized')));

        const result = orejs.transferOre(ORE_TESTA_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance);
        expect(result).rejects.toThrow(/unauthorized/);
      });
    });
  });
});
