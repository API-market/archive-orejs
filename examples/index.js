const dotenv = require("dotenv")
const { Orejs } = require("../src")

dotenv.config()

function orejs() {
  console.log("Connected as", process.env.ORE_AUTH_ACCOUNT_NAME)
  return new Orejs({
    httpEndpoint: process.env.ORE_NETWORK_URI,
    keyProvider: process.env.ORE_AUTH_ACCOUNT_KEY,
    oreAuthAccountName: process.env.ORE_AUTH_ACCOUNT_NAME,
    sign: true
  })
}

module.exports = {
  orejs,
  walletPassword: process.env.WALLET_PASSWORD
}
