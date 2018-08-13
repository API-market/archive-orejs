const APIM_CONTRACT_NAME = 'manager.apim';
const INSTR_CONTRACT_NAME = 'instr.ore';
const INSTR_TABLE_NAME = 'tokens';

const ecc = require('eosjs-ecc');

/* Private */
async function getAllInstruments() {
  // Returns all the instruments
  const instruments = await this.getInstruments({
    code: 'instr.ore',
    table: 'tokens',
  });
  return instruments;
}

function isActive(instrument) {
  const startTime = instrument.instrument.start_time;
  const endTime = instrument.instrument.end_time;
  const currentTime = Math.floor(Date.now() / 1000);
  return (currentTime > startTime && currentTime < endTime);
}

/* Public */

function getRight(instrument, rightName) {
  const {
    instrument: {
      rights,
    } = {},
  } = instrument;

  const right = rights.find((rightObject) => {
    if (rightObject.right_name === rightName) {
      return rightObject;
    }
    return undefined;
  });
  return right;
}

async function findInstruments(oreAccountName, activeOnly = true, category = undefined, rightName = undefined) {
  // Where args is search criteria could include (category, rights_name)
  // It gets all the instruments owned by a user using secondary index on the owner key
  // Note: this requires an index on the rights collection (to filter right names)

  const tableKey = this.tableKey(oreAccountName);
  let instruments = await this.getInstruments({
    code: 'instr.ore',
    table: 'tokens',
    lower_bound: tableKey.toString(),
    upper_bound: tableKey.plus(1).toString(),
    key_name: 'owner',
  });
  if (activeOnly) {
    instruments = instruments.filter(element => isActive(element));
  }
  if (rightName) {
    instruments = await this.getInstrumentsByRight.bind(this)(instruments, rightName);
  }

  return instruments;
}

async function createOfferInstrument(oreAccountName, offerInstrumentData, confirm = false) {
  // Create an offer
  const options = {
    authorization: `${oreAccountName}@owner`,
  };
  const contract = await this.eos.contract(APIM_CONTRACT_NAME, options);
  if (confirm) {
    return this.confirmTransaction(() => contract.publishapi(oreAccountName, offerInstrumentData.issuer, offerInstrumentData.api_name, offerInstrumentData.additional_api_params, offerInstrumentData.api_payment_model, offerInstrumentData.api_price_in_cpu, offerInstrumentData.license_price_in_cpu, offerInstrumentData.api_description, offerInstrumentData.right_registry, offerInstrumentData.instrument_template, offerInstrumentData.start_time, offerInstrumentData.end_time, offerInstrumentData.override_offer_id, options));
  }
  contract.publishapi(oreAccountName, offerInstrumentData.issuer, offerInstrumentData.api_name, offerInstrumentData.additional_api_params, offerInstrumentData.api_payment_model, offerInstrumentData.api_price_in_cpu, offerInstrumentData.license_price_in_cpu, offerInstrumentData.api_description, offerInstrumentData.right_registry, offerInstrumentData.instrument_template, offerInstrumentData.start_time, offerInstrumentData.end_time, offerInstrumentData.override_offer_id, options);
  return this;
}

async function createVoucherInstrument(creator, buyer, offerId, overrideVoucherId = 0, offerTemplate = '', confirm = false) {
  // Exercise an offer to get a voucher
  // overrideVoucherId is passed in to specify the voucher id for the new voucher. If its value is 0, then the voucher id is auto generated
  // either offerTemplate or offerId could be passed in to get a voucher for that offer.
  if (offerId === 0 && offerTemplate === '') {
    throw new Error('Either pass in a valid offer id or a valid offer template');
  }
  const options = {
    authorization: `${creator}@owner`,
  };
  const contract = await this.eos.contract(APIM_CONTRACT_NAME, options);
  if (confirm) {
    return this.confirmTransaction(() => contract.licenseapi(creator, buyer, offerId, offerTemplate, overrideVoucherId, options));
  }
  contract.licenseapi(creator, buyer, offerId, offerTemplate, overrideVoucherId, options);
  return this;
}

async function signVoucher(apiVoucherId) {
  return ecc.sign(apiVoucherId.toString(), this.config.keyProvider[0]);
}

module.exports = {
  getRight,
  getAllInstruments,
  findInstruments,
  createOfferInstrument,
  createVoucherInstrument,
  signVoucher,
};