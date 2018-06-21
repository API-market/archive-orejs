const CPU_CONTRACT_NAME = 'ore.cpu'
const TABLE_NAME = 'accounts'

/* Public */

async function approveCpu(fromAccountName, toAccountName, cpuAmount) {
  let options = {authorization: `${fromAccountName}@active`}
  let contract = await this.eos.contract(CPU_CONTRACT_NAME, options)
  await contract.approvemore(fromAccountName, toAccountName, cpuAmount, options)
}

async function getCpuBalance(oreAccountName) {
  const table_key = this.tableKey(oreAccountName)
  const account = await this.findOne(CPU_CONTRACT_NAME, TABLE_NAME, table_key)
  return account.balance
}

module.exports = {
  approveCpu,
  getCpuBalance
}
