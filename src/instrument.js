const CONTRACT_NAME = 'ore.instrument'
const TABLE_NAME = 'instruments'

/* Mocks */

let voucher = {
  category: "apimarket.apiVoucher",
  class: "apiVoucher.io.hadron.spacetelescope.201801021211212",
  description: "Human-readable description (Hadron Spacetelescope Access - High Availability US West Datacenter)",
  type: "pass", //Ticket, Permit, or Pass
  options: {},
  consideration: undefined,
  benefit: undefined,
  issuer: "uztcnztga3di", // account name
  startDate: undefined,
  endDate: undefined,
  rights: {
    apiName: "io.hadron.spaceTelescope",
    options: {
      sla: "highAvailability",
      region: "usWest"
    },
    priceInCPU: 0.1,
    description: "Identify objects in image of deep space"
  }
}

let offer = {
  category: "apimarket.offer.licenseApi",
  class: "apiVoucher.io.hadron.spacetelescope.201801021211212",
  description: "Human-readable description (copied to the APIVouchers it creates)",
  type: "pass",
  options: {
    apiName: "io.hadron.spaceTelescope",
    sla: "default",
    paymentModel: "payPerCall"
  },
  consideration: undefined,
  benefit: undefined,
  issuer: "uztcnztga3di", // account name
  startDate: undefined,
  endDate: undefined,
  rights: {
    endpoint: "ore.contract.createApiVoucher",
    options: {
      action: "create"
    },
    priceInCPU: 0.1,
    description: "Create API Voucher"
  }
}

/* Private */

async function getAllInstruments(oreAccountName) {
  const table_key = this.tableKey(oreAccountName)
  // TODO Connect this to the instrument contract
  //const rows = await this.findOne(CONTRACT_NAME, TABLE_NAME, table_key)
  return [offer, voucher]
}

/* Public */

async function getInstruments(oreAccountName, category = undefined) {
  const rows = await getAllInstruments.bind(this)(oreAccountName)
  if (category) {
    return rows.filter(row => {
      return row.category.indexOf(category) >= 0
    })
  }
  return rows
}

async function findInstruments(oreAccountName, activeOnly = true, category = undefined, rightName = undefined) {
  // Where args is search criteria could include (category, rights_name)
  // Note: this requires an index on the rights collection (to filter right names)
  const rows = await getInstruments.bind(this)(oreAccountName, category)
  // TODO filter by activeOnly
  // TODO filter by rightName
  return rows
}

async function saveInstrument(instrument) {
  // Confirms that issuer in Instrument matches signature of transaction
  // Creates an instrument token, populate with params, save to issuer account
  // Saves endpoints to endpoints_published
  return instrument
}

async function exerciseInstrument(offerInstrumentId) {
  // Call the endpoint in the instrument, adding the options params (defined in the instrument), and passing in the considerations (required list of instruments)
  // Save the resulting instruments with current user set as holder
  return voucher
}

module.exports = {
  exerciseInstrument,
  findInstruments,
  getInstruments,
  saveInstrument
}
