const {
  expectFetch,
  mock,
} = require('./helpers/fetch');
const {
  constructOrejs,
} = require('./helpers/orejs');

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
      fetch.mockResponses(mock(`${cpuBalance}.0000 CPU`));
    });

    test('returns the cpu balance', async () => {
      cpuBalance = await orejs.getCpuBalance(ORE_TESTA_ACCOUNT_NAME);
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_currency_balance`);
      expect(cpuBalance).toEqual(cpuBalance);
    });
  });
});