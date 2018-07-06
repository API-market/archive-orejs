const APIM_CONTRACT_NAME = 'manager.apim'
const INSTR_CONTRACT_NAME = 'instr.ore'
const INSTR_USAGE_CONTRACT_NAME = 'usagelog.ore'
const INSTR_TABLE_NAME = 'tokens'
const LOG_TABLE_NAME = 'callcount'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

/* Private */

async function getAllInstruments(oreAccountName, additionalFilters = []) {
  additionalFilters.push({owner: oreAccountName})

  const rows = await this.getAllTableRowsFiltered({
    code: INSTR_CONTRACT_NAME,
    table: INSTR_TABLE_NAME,
  }, additionalFilters )

  return rows
}

function getRight(instrument, rightName) {
  const rights = instrument["instrument"]["rights"]
  for (let i = 0; i < rights.length; i++) {
    let right = rights[i]
    if (right["right_name"] === rightName) {
      return right
    }
  }
}

function isActive(instrument) {
  const startTime = instrument["instrument"]["start_time"]
  const endTime = instrument["instrument"]["end_time"]
  const currentTime = Math.floor(Date.now() / 1000)
  return (currentTime > startTime && currentTime < endTime)
}

/* Public */

async function getInstruments(oreAccountName, category = undefined, filters = []) {
  if (category) {
    filters.push(function(row) {
      return row["instrument"]["instrument_class"] === category
    })
  }

  const rows = await getAllInstruments.bind(this)(oreAccountName, filters)
  return rows
}

async function findInstruments(oreAccountName, activeOnly = true, category = undefined, rightName = undefined) {
  // Where args is search criteria could include (category, rights_name)
  // Note: this requires an index on the rights collection (to filter right names)
  let filters = []
  if (activeOnly) {
    filters.push(function(row) {
      return isActive(row)
    })
  }
  if (rightName) {
    filters.push(function(row) {
      return getRight(row, rightName)
    })
  }
  const rows = await getInstruments.bind(this)(oreAccountName, category, filters)
  return rows
}

async function createInstrument(instrumentCreatorAccountName, instrumentOwnerAccountName, instrumentData) {
  // Confirms that issuer in Instrument matches signature of transaction
  // Creates an instrument token, populate with params, save to issuer account
  let {contract, options} = await this.contract(INSTR_CONTRACT_NAME, instrumentCreatorAccountName)

  const instrument = await contract.mint({"minter":instrumentCreatorAccountName, "owner":instrumentOwnerAccountName, "instrument":instrumentData}, options)

  return instrument
}

async function getApiCallStats(instrumentId, rightName){
  //calls the usagelog contract to get the total number of calls against a particular right
  let result = await this.eos.getAllTableRows({
    code: INSTR_USAGE_CONTRACT_NAME,
    table: LOG_TABLE_NAME,
    scope: instrumentId // new scoping
  })
  for (var i = 0; i < result.rows.length; i++) {
    if ( result.rows[i]["right_name"] === rightName) {
      const rightProprties = {"totalCalls": calls[i]["total_count"], "totalCpuUsage": calls[i]["total_cpu"]}
      return rightProprties
    }
  }
}


async function createOfferInstrument(oreAccountName, offerInstrumentData){
  // Create an offer
  let options = {authorization: `${oreAccountName}@owner`}
  let contract = await this.eos.contract(APIM_CONTRACT_NAME, options)
  let instrument = await contract.publishapi(oreAccountName, offerInstrumentData.issuer, offerInstrumentData.api_name,offerInstrumentData.additional_api_params, offerInstrumentData.api_payment_model, offerInstrumentData.api_price_in_cpu, offerInstrumentData.license_price_in_cpu, offerInstrumentData.api_description, offerInstrumentData.right_registry, offerInstrumentData.start_time, offerInstrumentData.end_time, options)
  return instrument
}

async function createVoucherInstrument(oreAccountName, buyer, offerId){
  //Exercise an offer to get a voucher
  let options = {authorization: `${oreAccountName}@owner`}
  let contract = await this.eos.contract(APIM_CONTRACT_NAME, options)
  let instrument = await contract.licenseapi(oreAccountName, buyer, offerId, options)
  return instrument
}

module.exports = {
  findInstruments,
  getInstruments,
  getApiCallStats,
  createInstrument,
  createOfferInstrument,
  createVoucherInstrument,
}
