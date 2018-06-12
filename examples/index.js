const dotenv = require("dotenv")
const { Orejs } = require("../src")

dotenv.config()

module.exports = {
  orejs: new Orejs({
    chainId: process.env.CHAIN_ID,
    httpEndpoint: process.env.EOS_URI,
    keyProvider: process.env.ORE_AUTH_ACCOUNT_KEY,
    oreAuthAccountName: process.env.ORE_AUTH_ACCOUNT_NAME,
    sign: true
  }),
  walletPassword: process.env.WALLET_PASSWORD
}
