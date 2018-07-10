const APIM_CONTRACT_NAME = 'manager.apim'
const INSTR_CONTRACT_NAME = 'instr.ore'
const INSTR_USAGE_CONTRACT_NAME = 'usagelog.ore'
const INSTR_TABLE_NAME = 'tokens'
const LOG_COUNT_TABLE_NAME = 'counts'
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


function rightExist(instrument, rightName){
  // Checks if a right belongs to an instrument
  const rights = instrument["instrument"]["rights"]
  for (let i = 0; i < rights.length; i++) {
    let right = rights[i]
    if (right["right_name"] === rightName) {
      return true
    }
  }
  return false
}

function isActive(instrument) {
  const startTime = instrument["instrument"]["start_time"]
  const endTime = instrument["instrument"]["end_time"]
  const currentTime = Math.floor(Date.now() / 1000)
  return (currentTime > startTime && currentTime < endTime)
}

/* Public */

async function getInstruments(oreAccountName, category = undefined, filters = []) {
  //gets the instruments belonging to a particular category
  if (category) {
    filters.push(function(row) {
      return row["instrument"]["instrument_class"] === category
    })
  }

  const rows = await getAllInstruments.bind(this)(oreAccountName, filters)
  return rows
}

async function getInstrumentByRight(instrumentList, rightName){
  // Gets all the instruments with a particular right
  let instruments = []
  for (let i = 0; i < instrumentList.length; i++) {
    if(rightExist(instrumentList[i], rightName)){
      instruments.push(instrumentList[i])
    }
  }
  
  return instruments
}

async function getInstrumentByOwner(instrumentList, owner){
  // Get all the instruments with a particular owner
  let instruments = []
  for (let i = 0; i < instrumentList.length; i++) {
    if(instrumentList[i]["owner"] === owner){
      instruments.push(instrumentList[i])
    }
  } 
  return instruments
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
  let result = await this.eos.getTableRows({
    code: INSTR_USAGE_CONTRACT_NAME,
    json: true,
    scope: instrumentId,
    table: LOG_COUNT_TABLE_NAME,
    limit: -1
  })

  for (let i = 0; i < result.rows.length; i++) {
    if ( result.rows[i]["right_name"] === rightName) {
      const rightProprties = {"totalApiCalls": result.rows[i]["total_count"], "totalCpuUsage": result.rows[i]["total_cpu"]}
      return rightProprties
    }
  }
}

async function getRightStats(rightName, owner){
  // Returns the total cpu and api calls against a particular right across all the vouchers. If owner specified, then returns the toatal api calls and cpu usage for the owner.
  let instruments
  let instrumentList
  let totalCpuUsage = 0
  let totalApiCalls = 0
  let rightProprties

  instrumentList = await this.getAllTableRows({
    code: INSTR_CONTRACT_NAME,
    scope: INSTR_CONTRACT_NAME,
    table: INSTR_TABLE_NAME,
    limit: -1
  })

  instruments = await getInstrumentByRight(instrumentList, rightName)

  if(owner){
    instruments = await getInstrumentByOwner(instruments, owner)
  }

  for (let i = 0; i < instruments.length; i++) {
    rightProprties = await getApiCallStats.bind(this)(instruments[i].id, rightName)
    totalCpuUsage += rightProprties["totalCpuUsage"]
    totalApiCalls += rightProprties["totalApiCalls"]
  }
  return {totalCpuUsage, totalApiCalls}  
}


async function createOfferInstrument(oreAccountName, offerInstrumentData){
  // Create an offer
  let options = {authorization: `${oreAccountName}@owner`}
  let contract = await this.eos.contract(APIM_CONTRACT_NAME, options)
  let instrument = await contract.publishapi(oreAccountName, offerInstrumentData.issuer, offerInstrumentData.api_name,offerInstrumentData.additional_api_params, offerInstrumentData.api_payment_model, offerInstrumentData.api_price_in_cpu, offerInstrumentData.license_price_in_cpu, offerInstrumentData.api_description, offerInstrumentData.right_registry, offerInstrumentData.start_time, offerInstrumentData.end_time, options)
  return instrument
}

async function createVoucherInstrument(creator, buyer, offerId){
  //Exercise an offer to get a voucher
  let options = {authorization: `${creator}@owner`}
  let contract = await this.eos.contract(APIM_CONTRACT_NAME, options)
  let instrument = await contract.licenseapi(creator, buyer, offerId, options)
  return instrument
}

module.exports = {
  getRight,
  findInstruments,
  getInstruments,
  getApiCallStats,
  getRightStats,
  createInstrument,
  createOfferInstrument,
  createVoucherInstrument,
}
