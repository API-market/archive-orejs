const CONTRACT_NAME = 'token.eos2'
const TABLE_NAME = 'accounts'

/* Public */

async function getCpuBalance(oreAccountName) {
  const table_key = this.tableKey(oreAccountName)
  const account = await this.findOne(CONTRACT_NAME, TABLE_NAME, table_key)
  return account.balance
}

module.exports = {
  getCpuBalance
}
