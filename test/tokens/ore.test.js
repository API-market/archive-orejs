/* global ORE_NETWORK_URI:true */
/* global ORE_OWNER_ACCOUNT_NAME:true */
/* global ORE_TESTA_ACCOUNT_NAME:true */
const {
  expectFetch,
  mock,
  mockInfo,
} = require('../helpers/fetch');
const {
  constructOrejs,
  mockGetBlock,
  mockGetCurrency,
  mockGetInfo,
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
      mockGetCurrency(orejs, `${oreBalance}.0000 ORE`);
    });

    it('returns the ore balance', async () => {
      oreBalance = await orejs.getOreBalance(ORE_TESTA_ACCOUNT_NAME);
      expect(oreBalance).toEqual(oreBalance);
    });
  });

  describe('approveOre', () => {
    let oreBalance;
    let memo;

    beforeEach(() => {
      oreBalance = 10;
      memo = 'approve ORE transfer';
      fetch.resetMocks();
      mockGetCurrency(orejs, `${oreBalance}.0000 ORE`);
    });

    describe('when authorized', () => {
      xit('returns', async () => {
        mockGetInfo(orejs);
        mockGetBlock(orejs);
        const result = await orejs.approveOre(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance, memo);
        expect(contract.approve).toHaveBeenCalledWith(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, `${oreBalance}.0000 ORE`, memo, {
          authorization: `${ORE_OWNER_ACCOUNT_NAME}@active`,
        });
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

    beforeEach(() => {
      oreBalance = 10;
    });

    describe('when authorized', () => {
      xit('returns', async () => {
        const result = await orejs.transferOre(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance);
        expect(contract.transfer).toHaveBeenCalledWith(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, `${oreBalance}.0000 ORE`, '', {
          authorization: `${ORE_OWNER_ACCOUNT_NAME}@active`,
        });
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
