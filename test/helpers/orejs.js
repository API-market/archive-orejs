const { Orejs } = require("../../src")
const { mockInfo } = require("./fetch")

function constructOrejs() {
  fetch.mockResponses(mockInfo())

  orejs = new Orejs({
    httpEndpoint: ORE_NETWORK_URI,
    keyProvider: [ORE_OWNER_ACCOUNT_KEY],
    orePayerAccountName: ORE_PAYER_ACCOUNT_NAME,
    sign: true
  })

  return orejs
}

module.exports = {
  constructOrejs
}
