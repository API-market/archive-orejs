const dotenv = require("dotenv")
const { Orejs, ore } = require("../src")

dotenv.config()

function orejs() {
  console.log("Connected as", process.env.ORE_PAYER_ACCOUNT_NAME, "@", process.env.ORE_NETWORK_URI)
  return new Orejs({
    chainId: process.env.CHAIN_ID,
    httpEndpoint: process.env.ORE_NETWORK_URI,
    keyProvider: process.env.ORE_PAYER_ACCOUNT_KEY,
    orePayerAccountName: process.env.ORE_PAYER_ACCOUNT_NAME,
    sign: true
  })
}

module.exports = {
  ore,
  orejs,
  walletPassword: process.env.WALLET_PASSWORD
}
