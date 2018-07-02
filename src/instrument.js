const APIM_CONTRACT_NAME = 'manager.apim'
const INSTR_CONTRACT_NAME = 'instr.ore'
const INSTR_USAGE_CONTRACT_NAME = 'usagelog.ore'
const TABLE_NAME = 'instruments'
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

/* Private */

async function getAllInstruments(oreAccountName, additionalFilters = []) {
  additionalFilters.push({owner: oreAccountName})

  const rows = await this.getAllTableRowsFiltered({
    code: INSTR_CONTRACT_NAME,
    table: 'tokens',
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
  const startDate = instrument["instrument"]["start_time"]
  const endDate = instrument["instrument"]["end_time"]
  const currentDate = Date.now()
  return (currentDate > startDate && currentDate < endDate)
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

async function saveInstrument(oreAccountName, instrument) {
  // Confirms that issuer in Instrument matches signature of transaction
  // Creates an instrument token, populate with params, save to issuer account
  // Saves endpoints to endpoints_published
  let options = {authorization: `${oreAccountName}@active`}
  let contract = await this.eos.contract(APIM_CONTRACT_NAME, options)
  let start_time = Date.now()
  let end_time = Date.now() + ONE_YEAR
  await contract.publishapi(oreAccountName, instrument.apiName, instrument.rights, instrument.description, start_time, end_time, options)

  return instrument
}

async function exerciseInstrument(oreAccountName, offerInstrumentId) {
  // Call the endpoint in the instrument, adding the options params (defined in the instrument), and passing in the considerations (required list of instruments)
  // Save the resulting instruments with current user set as holder
  let options = {authorization: `${oreAccountName}@active`}
  let contract = await this.eos.contract(APIM_CONTRACT_NAME, options)
  let voucher = await contract.licenceapi(oreAccountName, offerInstrumentId, options)

  return voucher
}

async function getAPiCallCount(rightName){
  //calls the usagelog contract to get the total number of calls against a particular right
  let options = {authorization: `${oreAccountName}@active`}
  let calls = await eos.getAllTableRows({
    code: INSTR_USAGE_CONTRACT_NAME,
    table: "callcount"
  })
  for (var i = 0; i < calls.length; i++) {
    if (calls[i]["right_name"] === rightName) {
      return calls[i]["total_count"]
    }
  }
}

async function getCpuUsage(rightName){
  //calls the usage log contraxct to get the total cpu payment for a particular right
  let options = {authorization: `${oreAccountName}@active`}
  let calls = await eos.getAllTableRows({
    code: INSTR_USAGE_CONTRACT_NAME,
    table: "callcount"
  })
  for (var i = 0; i < calls.length; i++) {
    if (calls[i]["right_name"] === rightName) {
      return calls[i]["total_cpu"]
    }
  }
}

module.exports = {
  exerciseInstrument,
  findInstruments,
  getInstruments,
  saveInstrument,
  getAPiCallCount,
  getCpuUsage
}
