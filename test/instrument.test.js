/* global ORE_OWNER_ACCOUNT_NAME:true */
/* global ORE_TESTA_ACCOUNT_NAME:true */
/* global ORE_NETWORK_URI:true */

const {
  expectFetch,
  mock,
  mockInstrument,
  mockInstruments,
} = require('./helpers/fetch');
const {
  constructOrejs,
  mockContract
} = require('./helpers/orejs');

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
      options = {
        authorization: `${ORE_OWNER_ACCOUNT_NAME}@owner`
      };
      contract = mockContract();
    });

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

    beforeEach(() => {
      active = {
        owner: ORE_TESTA_ACCOUNT_NAME,
      };
      expired = {
        owner: ORE_TESTA_ACCOUNT_NAME,
        instrument: {
          end_time: Math.floor(Date.now() / 1000) - 1
        }
      };
      uncategorized = {
        owner: ORE_TESTA_ACCOUNT_NAME,
        instrument: {
          instrument_class: 'apimarket.uncategorized'
        }
      };
      additionalRighted = {
        owner: ORE_TESTA_ACCOUNT_NAME,
        instrument: {
          instrument_class: 'apimarket.uncategorized',
          rights: [{
            right_name: 'apimarket.nobody.licenseApi'
          }]
        }
      };

      instrumentMocks = mockInstruments([
        active,
        additionalRighted,
        expired,
        uncategorized,
      ]);

      fetch.resetMocks();
      fetch.mockResponses(instrumentMocks);
    });

    test('returns all active instruments for account', async () => {
      const instruments = await orejs.findInstruments(ORE_TESTA_ACCOUNT_NAME);
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      expect(instruments).toEqual([JSON.parse(instrumentMocks[0]).rows[0], JSON.parse(instrumentMocks[0]).rows[1], JSON.parse(instrumentMocks[0]).rows[3]]);
    });

    test('returns all instruments', async () => {
      const instruments = await orejs.findInstruments(ORE_TESTA_ACCOUNT_NAME, false);
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_table_rows`);
      expect(instruments).toEqual([JSON.parse(instrumentMocks[0]).rows[0], JSON.parse(instrumentMocks[0]).rows[1], JSON.parse(instrumentMocks[0]).rows[2], JSON.parse(instrumentMocks[0]).rows[3]]);
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
    let rights;

    beforeEach(() => {
      rightName = 'apimarket.somebody.licenseApi';
    });

    describe('when multiple rights exist', async () => {
      beforeEach(() => {
        rights = [{
          right_name: 'apimarket.left.licenseApi'
        }, {
          right_name: rightName,
        }, {
          right_name: 'apimarket.right.licenseApi'
        }];
        instrument = mockInstrument({
          owner: ORE_TESTA_ACCOUNT_NAME,
          instrument: {
            instrument_class: 'apimarket.uncategorized',
            rights,
          }
        });
      });

      test('returns the correct right', async () => {
        const right = await orejs.getRight(instrument, rightName);
        expect(right).toEqual(instrument.instrument.rights[1]);
      });
    });

    describe('when the right does not exist', async () => {
      beforeEach(() => {
        rights = [{
          right_name: 'apimarket.left.licenseApi'
        }, {
          right_name: 'apimarket.right.licenseApi'
        }];
        instrument = mockInstrument({
          owner: ORE_TESTA_ACCOUNT_NAME,
          instrument: {
            instrument_class: 'apimarket.uncategorized',
            rights
          }
        });
      });

      test('returns nothing', async () => {
        const right = await orejs.getRight(instrument, rightName);
        expect(right).toEqual(undefined);
      });
    });
  });

  describe('signVoucher', () => {
    test('signs a voucher', async () => {
      const voucherId = 0;
      const sig = await orejs.signVoucher(voucherId);
      expect(sig.toString()).toEqual('SIG_K1_K7SnTcWTVuatvRepJ6vmmiHPEh3WWEYiVPB1nD9MZ3LWz91yUxR5fUWmSmNAAP9Dxs2MeKZuDUFoEVfBiKfRozaG2FzfvH');
    });
  });
});