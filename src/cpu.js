const BigNumber = require("bignumber.js")

const CONTRACT_NAME = 'token.eos2'
const TABLE_NAME = 'accounts'

async function getCpuBalance(oreAccountName) {
  const code = await this.eos.contract(CONTRACT_NAME)
  const table_key = new BigNumber(this.eos.format.encodeName(oreAccountName, false))
  const accounts = await this.eos.getTableRows({
    code: CONTRACT_NAME,
    json: true,
    limit: 1,
    lower_bound: table_key.toString(),
    scope: CONTRACT_NAME,
    table: TABLE_NAME,
    upper_bound: table_key.plus(1).toString()
  })
  const balance = accounts.rows[0].balance
  return balance
}

module.exports = {
  getCpuBalance
}
