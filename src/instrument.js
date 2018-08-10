const APIM_CONTRACT_NAME = 'manager.apim';
const INSTR_CONTRACT_NAME = 'instr.ore';
const INSTR_USAGE_CONTRACT_NAME = 'usagelog.ore';
const INSTR_TABLE_NAME = 'tokens';
const LOG_COUNT_TABLE_NAME = 'counts';

/* Private */

async function getAllInstruments(oreAccountName, additionalFilters = []) {
  additionalFilters.push({
    owner: oreAccountName,
  });

  const rows = await this.getAllTableRowsFiltered({
    code: INSTR_CONTRACT_NAME,
    table: INSTR_TABLE_NAME,
  }, additionalFilters);

  return rows;
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


function rightExists(instrument, rightName) {
  // Checks if a right belongs to an instrument
  const {
    instrument: {
      rights,
    } = {},
  } = instrument;
  const right = rights.find(rightObject => rightObject.right_name === rightName);
  if (right !== undefined) {
    return true;
  }
  return false;
}

function isActive(instrument) {
  const startTime = instrument.instrument.start_time;
  const endTime = instrument.instrument.end_time;
  const currentTime = Math.floor(Date.now() / 1000);
  return (currentTime > startTime && currentTime < endTime);
}

/* Public */

async function getInstruments(oreAccountName, category = undefined, filters = []) {
  // Gets the instruments belonging to a particular category
  if (category) {
    filters.push(row => row.instrument.instrument_class === category);
  }

  const rows = await getAllInstruments.bind(this)(oreAccountName, filters);
  return rows;
}

async function getInstrumentsByRight(instrumentList, rightName) {
  // Gets all the instruments with a particular right
  const instruments = await instrumentList.filter(instrument => rightExists(instrument, rightName) === true);
  return instruments;
}

async function getInstrumentByOwner(instrumentList, owner) {
  // Get all the instruments with a particular owner
  let instruments = [];
  instruments = instrumentList.filter(instrument => instrument.owner === owner);

  return instruments;
}

async function findInstruments(oreAccountName, activeOnly = true, category = undefined, rightName = undefined) {
  // Where args is search criteria could include (category, rights_name)
  // Note: this requires an index on the rights collection (to filter right names)
  const filters = [];
  if (activeOnly) {
    filters.push(row => isActive(row));
  }
  if (rightName) {
    filters.push(row => getRight(row, rightName));
  }
  const rows = await getInstruments.bind(this)(oreAccountName, category, filters);
  return rows;
}

async function getApiCallStats(instrumentId, rightName) {
  // calls the usagelog contract to get the total number of calls against a particular right
  const result = await this.eos.getTableRows({
    code: INSTR_USAGE_CONTRACT_NAME,
    json: true,
    scope: instrumentId,
    table: LOG_COUNT_TABLE_NAME,
    limit: -1,
  });

  const rightProperties = {
    totalApiCalls: 0,
    totalCpuUsage: 0,
  };

  const rightObject = await result.rows.find(right => right.right_name === rightName);

  if (rightObject !== undefined) {
    rightProperties.totalApiCalls = rightObject.total_count;
    rightProperties.totalCpuUsage = rightObject.total_cpu;
  }

  return rightProperties;
}

async function getRightStats(rightName, owner) {
  // Returns the total cpu and api calls against a particular right across all the vouchers. If owner specified, then returns the toatal api calls and cpu usage for the owner.
  let instruments;
  let rightProperties;

  const instrumentList = await this.getAllTableRows({
    code: INSTR_CONTRACT_NAME,
    scope: INSTR_CONTRACT_NAME,
    table: INSTR_TABLE_NAME,
    limit: -1,
  });

  instruments = await getInstrumentsByRight(instrumentList, rightName);

  if (owner) {
    instruments = await getInstrumentByOwner(instruments, owner);
  }

  // Get the total cpu calls and cpu count across all the instruments
  const results = instruments.map(async (instrumentObject) => {
    rightProperties = await getApiCallStats.bind(this)(instrumentObject.id, rightName);
    return rightProperties;
  });

  const value = await Promise.all(results);

  return {
    totalCpuUsage: value.reduce((a, b) => a + parseFloat(b.totalCpuUsage), 0),
    totalApiCalls: value.reduce((a, b) => a + parseFloat(b.totalApiCalls), 0),
  };
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

module.exports = {
  getRight,
  findInstruments,
  getInstruments,
  getApiCallStats,
  getRightStats,
  createOfferInstrument,
  createVoucherInstrument,
};
