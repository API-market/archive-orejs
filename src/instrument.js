function getInstruments(oreAccountName, category = undefined) {
  // Calls instrument byHolder(oreAccountName)
  // Filters instruments by category (if provided)
  // return [instruments]
}

function findInstruments(oreAccountName, activeOnly, category = undefined, right_name = undefined) {
  // Where args is search criteria could include (category, rights_name)
  // Note: this requires an index on the rights collection (to filter right names)
  // return [instruments]
}

function saveInstrument (instrument) {
  // Confirms that issuer in Instrument matches signature of transaction
  // Creates an instrument token, populate with params, save to issuer account
  // Saves endpoints to endpoints_published
}

function exerciseInstrument(offerInstrumentId) {
  // Call the endpoint in the instrument, adding the options params (defined in the instrument), and passing in the considerations (required list of instruments)
  // Save the resulting instruments with current user set as holder
}

module.exports = {
  exerciseInstrument,
  findInstruments,
  getInstruments,
  saveInstrument
}
