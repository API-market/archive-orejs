const dotenv = require("dotenv")
const { Orejs } = require("../src")

dotenv.config()

module.exports = {
  orejs: new Orejs({keyProvider: process.env.KEY_PROVIDER}),
  walletPassword: process.env.WALLET_PASSWORD
}
