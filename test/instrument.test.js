const { expectFetch, mock, mockInstruments } = require('./helpers/fetch');
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
    let instrumentMocks, active, inactive, unowned;

    beforeEach(() => {
      active = {owner: ORE_TESTA_ACCOUNT_NAME}
      inactive = {owner: ORE_TESTA_ACCOUNT_NAME, instrument: {end_time: Date.now() - 1}}
      unowned = {owner: ORE_OWNER_ACCOUNT_NAME}

      instrumentMocks = mockInstruments([
        active,
        inactive,
        unowned
      ])

      fetch.resetMocks()
      fetch.mockResponses(instrumentMocks)
    });

    // TODO Cover edge cases
    //async function findInstruments(oreAccountName, activeOnly = true, category = undefined, rightName = undefined) {

    test('returns all active instruments for account', async () => {
      let instruments = await orejs.findInstruments(ORE_TESTA_ACCOUNT_NAME)
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      //instruments = orejs.getInstrumentByOwner(instruments, ORE_TESTA_ACCOUNT_NAME)
      expect(instruments).toEqual([JSON.parse(instrumentMocks[0]).rows[0]])
    });
  });

  describe('getRight', () => {
    let contract;

    beforeEach(() => {
      //contract = mockContract();
    });

    test('returns a right', async () => {
      // TODO
      //await orejs.getRight(instrument, rightName)
      //expect(JSON.stringify(accountContents)).toEqual(account[0])
    });
  });

  describe('getRightStats', () => {
    let contract;

    beforeEach(() => {
      //fetch.resetMocks()
      //fetch.mockResponses(mockInstrument(), mock({ totalCpuUsage: 28, totalApiCalls: 28 }))
    });

    // TODO Cover edge cases

    test('returns stats', async () => {
      //const stats = await orejs.getRightStats('cloud.hadron.contest-2018-07', ORE_TESTA_ACCOUNT_NAME)
      //expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      // FIXME get second mock to return
      //expect(stats).toEqual({ totalCpuUsage: 28, totalApiCalls: 28 })
    });
  });
});
