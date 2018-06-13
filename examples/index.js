const dotenv = require("dotenv")
const { Orejs } = require("../src")

dotenv.config()

module.exports = {
  orejs: new Orejs({
    httpEndpoint: process.env.ORE_NETWORK_URI,
    keyProvider: process.env.ORE_AUTH_ACCOUNT_KEY,
    oreAuthAccountName: process.env.ORE_AUTH_ACCOUNT_NAME,
    sign: true
  }),
  walletPassword: process.env.WALLET_PASSWORD
}
