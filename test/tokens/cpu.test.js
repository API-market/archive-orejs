/* global ORE_NETWORK_URI:true */
/* global ORE_OWNER_ACCOUNT_NAME:true */
/* global ORE_TESTA_ACCOUNT_NAME:true */
/* global ORE_TESTB_ACCOUNT_NAME:true */
const {
  expectFetch,
  mock,
  mockInfo,
} = require('../helpers/fetch');
const {
  constructOrejs,
  mockContract,
} = require('../helpers/orejs');

describe('cpu', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('getCpuBalance', () => {
    let cpuBalance;

    beforeEach(() => {
      cpuBalance = 30;

      fetch.resetMocks();
      fetch.mockResponses(mock([`${cpuBalance}.0000 CPU`]));
    });

    test('returns the cpu balance', async () => {
      cpuBalance = await orejs.getCpuBalance(ORE_TESTA_ACCOUNT_NAME);
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_currency_balance`);
      expect(cpuBalance).toEqual(cpuBalance);
    });
  });

  describe('approveCpu', () => {
    let contract;
    let cpuBalance;
    let memo;

    beforeEach(() => {
      contract = mockContract();
      memo = 'approve CPU transfer';
      cpuBalance = 10;
      fetch.resetMocks();
      fetch.mockResponses(mock([`${cpuBalance}.0000 CPU`]));
    });

    describe('when authorized', () => {
      test('returns', async () => {
        const result = await orejs.approveCpu(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, cpuBalance, memo);
        expect(contract.approve).toHaveBeenCalledWith(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, `${cpuBalance}.0000 CPU`, memo, {
          authorization: `${ORE_OWNER_ACCOUNT_NAME}@active`,
        });
      });
    });

    describe('when unauthorized', () => {
      test('throws', () => {
        contract.approve.mockImplementationOnce(() => Promise.reject(new Error('unauthorized')));

        const result = orejs.approveCpu(ORE_TESTA_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, cpuBalance);
        expect(result).rejects.toThrow(/unauthorized/);
      });
    });
  });

  describe('getApprovedCpuBalance', () => {
    let contract;
    let cpuBalance;
    let memo;

    beforeEach(() => {
      contract = mockContract();
      cpuBalance = 10;
      memo = 'approve CPU transfer';
      fetch.resetMocks();
    });

    describe('when approved', () => {
      beforeEach(() => {
        fetch.mockResponses(mock([`${cpuBalance}.0000 CPU`]), mock({
          rows: [{
            to: ORE_TESTA_ACCOUNT_NAME,
            quantity: '10.0000 CPU',
          }],
        }));
      });

      test('returns', async () => {
        await orejs.approveCpu(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, cpuBalance, memo);
        const approveAmount = await orejs.getApprovedCpuBalance(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME);
        expect(approveAmount).toEqual(`${cpuBalance}.0000 CPU`);
      });
    });

    describe('when not approved', () => {
      beforeEach(() => {
        fetch.mockResponses(mock({
          rows: [{
            to: ORE_TESTB_ACCOUNT_NAME,
            quantity: '0.0000 CPU',
          }],
        }));
      });

      test('returns', async () => {
        const approveAmount = await orejs.getApprovedCpuBalance(ORE_OWNER_ACCOUNT_NAME, ORE_TESTB_ACCOUNT_NAME);
        expect(approveAmount).toEqual('0.0000 CPU');
      });
    });
  });

  describe('transferCpu', () => {
    let contract;
    let cpuBalance;

    beforeEach(() => {
      contract = mockContract();
      cpuBalance = 10;
    });

    describe('when authorized', () => {
      test('returns', async () => {
        const result = await orejs.transferCpu(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, cpuBalance);
        expect(contract.transfer).toHaveBeenCalledWith(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, `${cpuBalance}.0000 CPU`, '', {
          authorization: `${ORE_OWNER_ACCOUNT_NAME}@active`,
        });
      });
    });

    describe('when unauthorized', () => {
      test('throws', () => {
        contract.approve.mockImplementationOnce(() => Promise.reject(new Error('unauthorized')));

        const result = orejs.transferCpu(ORE_TESTA_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, cpuBalance);
        expect(result).rejects.toThrow(/unauthorized/);
      });
    });
  });
});