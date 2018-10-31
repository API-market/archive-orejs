const APIM_CONTRACT_NAME = 'manager.apim';

const ecc = require('eosjs-ecc');

async function createVoucherInstrument(creator, buyer, offerId, overrideVoucherId = 0, offerTemplate = '', confirm = false) {
  // Exercise an offer to get a voucher
  // overrideVoucherId is passed in to specify the voucher id for the new voucher. If its value is 0, then the voucher id is auto generated
  // either offerTemplate or offerId could be passed in to get a voucher for that offer.
  if (offerId === 0 && offerTemplate === '') {
    throw new Error('Either pass in a valid offer id or a valid offer template');
  }
  const options = {
    authorization: `${creator}@active`,
  };
  const contract = await this.eos.getContract(APIM_CONTRACT_NAME, options);
  if (confirm) {
    return this.awaitTransaction(() => contract.licenseapi(creator, buyer, offerId, offerTemplate, overrideVoucherId, options));
  }
  contract.licenseapi(creator, buyer, offerId, offerTemplate, overrideVoucherId, options);
  return this;
}

async function signVoucher(voucherId) {
  return ecc.sign(voucherId.toString(), this.config.keyProvider[0]);
}

module.exports = {
  createVoucherInstrument,
  signVoucher,
};
