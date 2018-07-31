const dotenv = require("dotenv")
const {
  Orejs,
  crypto
} = require("../src")

dotenv.config()

function orejs(accountName, ...accountKeys) {
  console.log("Connected as", accountName, "@", process.env.ORE_NETWORK_URI)
  console.log(accountKeys)
  return new Orejs({
    httpEndpoint: process.env.ORE_NETWORK_URI,
    keyProvider: accountKeys,
    orePayerAccountName: process.env.ORE_PAYER_ACCOUNT_NAME,
    sign: true,
    chainId: "428d1f293efdf76bef1748998a67d4d465825258c49737c03aa06893ca63650d"
  })
}

module.exports = {
  orejs,
  crypto,
  walletPassword: process.env.WALLET_PASSWORD
}