const {
  constructOrejs,
  mockGetAbi,
  mockGetBlock,
  mockGetInfo,
} = require('../helpers/orejs');

describe('voucher', () => {
  let orejs;

  beforeAll(() => {
    orejs = constructOrejs();
  });

  describe('createVoucherInstrument', () => {
    let offerId;
    let offerTemplate;
    let overrideVoucherId;
    let options;

    beforeEach(() => {
      offerId = 1;
      offerTemplate = '';
      overrideVoucherId = 0;
    });

    xit('returns', async () => {
      mockGetInfo(orejs);
      mockGetBlock(orejs);
      mockGetAbi(orejs);
      await orejs.createVoucherInstrument(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, offerId);
      //expect(contract.licenseapi).toHaveBeenCalledWith(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, offerId, offerTemplate, overrideVoucherId, options);
    });
  });

  describe('signVoucher', () => {
    it('signs a voucher', async () => {
      const voucherId = 0;
      const sig = await orejs.signVoucher(voucherId);
      expect(sig.toString()).toEqual('SIG_K1_K7SnTcWTVuatvRepJ6vmmiHPEh3WWEYiVPB1nD9MZ3LWz91yUxR5fUWmSmNAAP9Dxs2MeKZuDUFoEVfBiKfRozaG2FzfvH');
    });
  });
});
