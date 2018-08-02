const { expectFetch, mock, mockInstrument } = require('./helpers/fetch');
const { constructOrejs, mockContract } = require('./helpers/orejs');

describe('instrument', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('createVoucherInstrument', () => {
    let contract;

    beforeEach(() => {
      //contract = mockContract();
    });

    test('returns', async () => {
      //await orejs.createVoucherInstrument(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, 1)
      //expect(JSON.stringify(accountContents)).toEqual(account[0])
    });
  });

  describe('findInstruments', () => {
    let instr;

    beforeEach(() => {
      instr = mockInstrument()

      fetch.resetMocks()
      fetch.mockResponses(instr)
    });

    test('returns an instrument', async () => {
      const instrument = await orejs.findInstruments(ORE_OWNER_ACCOUNT_NAME)
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      expect(instrument).toEqual(JSON.parse(instr[0]).rows)
    });
  });

  describe('getRight', () => {
    let contract;

    beforeEach(() => {
      //contract = mockContract();
    });

    test('returns a right', async () => {
      //await orejs.getRight(instrument, rightName)
      //expect(JSON.stringify(accountContents)).toEqual(account[0])
    });
  });

  describe('getRightStats', () => {
    let contract;

    beforeEach(() => {
      //contract = mockContract();

      /*
      fetch.resetMocks()
      fetch.mockResponses(mock({ totalCpuUsage: 28, totalApiCalls: 28 }))
      */
    });

    test('returns stats', async () => {
      //const stats = await orejs.getRightStats('rightName', ORE_TESTA_ACCOUNT_NAME)
      //expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      //expect(JSON.stringify(accountContents)).toEqual(account[0])
    });
  });
});
