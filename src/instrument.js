const APIM_CONTRACT_NAME = 'manager.apim';
const INSTR_CONTRACT_NAME = 'instr.ore';
const INSTR_TABLE_NAME = 'tokensv2';

const ecc = require('eosjs-ecc');

/* Private */
function isActive(instrument) {
  const startTime = instrument.instrument.start_time;
  const endTime = instrument.instrument.end_time;
  const currentTime = Math.floor(Date.now() / 1000);
  return (currentTime > startTime && currentTime < endTime);
}

/* Public */
async function getInstruments(params) {
  // Returns instruments indexed by owner/instrumentTemplate/instrumentClass
  // Returns all instruments by default
  let keyType;
  let index;
  let results = [];
  const lowerBound = 0;
  const upperBound = -1;
  const limit = -1;
  if (params.key_name === 'owner') {
    keyType = 'i64';
    index = 2;
  } else if (params.key_name === 'instrument_template') {
    keyType = 'i64';
    index = 3;
  } else if (params.key_name === 'instrument_class') {
    keyType = 'i64';
    index = 4;
  } else {
    // index by instrument_id
    keyType = 'i64';
    index = 1;
  }
  const parameters = {
    ...params,
    json: true,
    lower_bound: params.lower_bound || lowerBound,
    upper_bound: params.upper_bound || upperBound,
    scope: params.scope || params.code,
    limit: params.limit || limit,
    key_type: keyType || 'i64',
    index_position: index || 1,
  };
  results = await this.eos.getTableRows(parameters);
  return results.rows;
}

async function getAllInstruments() {
  // Returns all the instruments
  const instruments = await getInstruments.bind(this)({
    code: 'instr.ore',
    table: 'tokensv2',
  });
  return instruments;
}

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

function hasCategory(instrument, category) {
  if (instrument.instrument.instrument_class === category) {
    return true;
  }
  return false;
}

async function findInstruments(oreAccountName, activeOnly = true, category = undefined, rightName = undefined) {
  // Where args is search criteria could include (category, rights_name)
  // It gets all the instruments owned by a user using secondary index on the owner key
  // Note: this requires an index on the rights collection (to filter right names)

  const tableKey = this.tableKey(oreAccountName);
  let instruments = await getInstruments.bind(this)({
    code: 'instr.ore',
    table: 'tokensv2',
    lower_bound: tableKey.toString(),
    upper_bound: tableKey.plus(1).toString(),
    key_name: 'owner',
  });

  if (activeOnly) {
    instruments = instruments.filter(element => isActive(element));
  }

  if (category) {
    instruments = instruments.filter(element => hasCategory(element, category));
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