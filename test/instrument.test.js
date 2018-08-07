/* global ORE_OWNER_ACCOUNT_NAME:true */
/* global ORE_TESTA_ACCOUNT_NAME:true */
/* global ORE_NETWORK_URI:true */
const {
  expectFetch, mock, mockInstrument, mockInstruments,
} = require('./helpers/fetch');
const { constructOrejs, mockContract } = require('./helpers/orejs');

describe('instrument', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('createVoucherInstrument', () => {
    let contract;
    let offerId;
    let offerTemplate;
    let overrideVoucherId;
    let options;

    beforeEach(() => {
      offerId = 1;
      offerTemplate = '';
      overrideVoucherId = 0;
      options = { authorization: `${ORE_OWNER_ACCOUNT_NAME}@owner` };
      contract = mockContract();
    });

    // TODO Cover edge cases

    test('returns', async () => {
      await orejs.createVoucherInstrument(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, offerId);
      expect(contract.licenseapi).toHaveBeenCalledWith(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, offerId, offerTemplate, overrideVoucherId, options);
    });
  });

  describe('findInstruments', () => {
    let instrumentMocks;
    let active;
    let additionalRighted;
    let expired;
    let uncategorized;
    let unowned;

    beforeEach(() => {
      active = { owner: ORE_TESTA_ACCOUNT_NAME };
      expired = { owner: ORE_TESTA_ACCOUNT_NAME, instrument: { end_time: Math.floor(Date.now() / 1000) - 1 } };
      uncategorized = { owner: ORE_TESTA_ACCOUNT_NAME, instrument: { instrument_class: 'apimarket.uncategorized' } };
      additionalRighted = { owner: ORE_TESTA_ACCOUNT_NAME, instrument: { instrument_class: 'apimarket.uncategorized', rights: [{ right_name: 'apimarket.nobody.licenseApi' }] } };
      unowned = { owner: ORE_OWNER_ACCOUNT_NAME };

      instrumentMocks = mockInstruments([
        active,
        additionalRighted,
        expired,
        uncategorized,
        unowned,
      ]);

      fetch.resetMocks();
      fetch.mockResponses(instrumentMocks);
    });

    // TODO Cover edge cases

    test('returns all active instruments for account', async () => {
      const instruments = await orejs.findInstruments(ORE_TESTA_ACCOUNT_NAME);
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      expect(instruments).toEqual([JSON.parse(instrumentMocks[0]).rows[0], JSON.parse(instrumentMocks[0]).rows[1], JSON.parse(instrumentMocks[0]).rows[3]]);
    });

    test('filters by category', async () => {
      const instruments = await orejs.findInstruments(ORE_TESTA_ACCOUNT_NAME, true, 'apimarket.uncategorized');
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      expect(instruments).toEqual([JSON.parse(instrumentMocks[0]).rows[1], JSON.parse(instrumentMocks[0]).rows[3]]);
    });

    test('filters by right', async () => {
      const instruments = await orejs.findInstruments(ORE_TESTA_ACCOUNT_NAME, true, 'apimarket.uncategorized', 'apimarket.nobody.licenseApi');
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      expect(instruments).toEqual([JSON.parse(instrumentMocks[0]).rows[1]]);
    });
  });

  describe('getRight', () => {
    let instrument;
    let rightName;

    beforeEach(() => {
      rightName = 'apimarket.nobody.licenseApi';
      instrument = mockInstrument({ owner: ORE_TESTA_ACCOUNT_NAME, instrument: { instrument_class: 'apimarket.uncategorized', rights: [{ right_name: rightName }] } });
    });

    // TODO Cover edge cases

    test('returns a right', async () => {
      const right = await orejs.getRight(instrument, rightName);
      expect(right).toEqual(instrument.instrument.rights[0]);
    });
  });

  describe('getRightStats', () => {
    let rightName;
    let totalCpu;
    let totalCount;

    beforeEach(() => {
      rightName = 'cloud.hadron.contest-2018-07';
      totalCpu = 10;
      totalCount = 20;

      fetch.resetMocks();
      fetch.mockResponses(mockInstruments([{ owner: ORE_TESTA_ACCOUNT_NAME, instrument: { rights: [{ right_name: rightName }] } }]), mock({ rows: [{ right_name: rightName, total_cpu: `${totalCpu}.0000 CPU`, total_count: totalCount }] }));
    });

    // TODO Cover edge cases

    test('returns stats', async () => {
      const stats = await orejs.getRightStats(rightName, ORE_TESTA_ACCOUNT_NAME);
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`, `${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      expect(stats).toEqual({ totalCpuUsage: totalCpu, totalApiCalls: totalCount });
    });
  });
});