const APIM_CONTRACT_NAME = 'apim.manager'
const INSTR_CONTRACT_NAME = 'ore.instr'
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
  instrument.start_time = instrument.start_time || Date.now()
  instrument.end_time = instrument.end_time || Date.now() + ONE_YEAR
  await contract.publishapi(oreAccountName, instrument.apiName, instrument.rights, instrument.description, instrument.start_time, instrument.end_time, options)

  return instrument
}

async function exerciseInstrument(oreAccountName, offerInstrumentId) {
  // Call the endpoint in the instrument, adding the options params (defined in the instrument), and passing in the considerations (required list of instruments)
  // Save the resulting instruments with current user set as holder
  let options = {authorization: `${oreAccountName}@active`}
  let contract = await this.eos.contract(APIM_CONTRACT_NAME, options)
  await contract.licenceapi(oreAccountName, offerInstrumentId, options)
}

module.exports = {
  exerciseInstrument,
  findInstruments,
  getInstruments,
  saveInstrument
}
