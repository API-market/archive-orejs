<<<<<<< HEAD
const { Orejs } = require('../../src');
const { mockInfo } = require('./fetch');

function constructOrejs() {
  fetch.mockResponses(mockInfo());
=======
const { Orejs } = require("../../src")
const { mockInfo } = require("./fetch")

function constructOrejs() {
  fetch.mockResponses(mockInfo())
>>>>>>> fc52a9a8d2360be8a0efaa73433517f54c7e0490

  orejs = new Orejs({
    httpEndpoint: ORE_NETWORK_URI,
    keyProvider: [ORE_OWNER_ACCOUNT_KEY],
    orePayerAccountName: ORE_PAYER_ACCOUNT_NAME,
<<<<<<< HEAD
    sign: true,
  });

  return orejs;
}

module.exports = {
  constructOrejs,
};
=======
    sign: true
  })

  return orejs
}

module.exports = {
  constructOrejs
}
>>>>>>> fc52a9a8d2360be8a0efaa73433517f54c7e0490
