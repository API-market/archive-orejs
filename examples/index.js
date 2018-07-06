const dotenv = require("dotenv")
const { Orejs, ore } = require("../src")

dotenv.config()

function orejs(accountName, accountKey) {
  console.log("Connected as", accountName, "@", process.env.ORE_NETWORK_URI)
  console.log(accountKey)
  return new Orejs({
    httpEndpoint: process.env.ORE_NETWORK_URI,
    keyProvider: [accountKey],
    orePayerAccountName: process.env.ORE_PAYER_ACCOUNT_NAME,
    sign: true
  })
}

module.exports = {
  ore,
  orejs,
  walletPassword: process.env.WALLET_PASSWORD
}
