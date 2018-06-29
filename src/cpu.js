const CPU_CONTRACT_NAME = 'cpu.ore'
const TABLE_NAME = 'accounts'

/* Public */

async function cpuContract(accountName) {
  let options = {authorization: `${accountName}@active`}
  let contract = await this.eos.contract(CPU_CONTRACT_NAME, options)
  return { contract, options }
}

async function approveCpu(fromAccountName, toAccountName, cpuAmount) {
  const { contract, options } = await cpuContract.bind(this)(fromAccountName)
  await contract.approvemore(fromAccountName, toAccountName, cpuAmount, options)
}

async function getCpuBalance(oreAccountName) {
  const table_key = this.tableKey(oreAccountName)
  const account = await this.findOne(CPU_CONTRACT_NAME, TABLE_NAME, table_key)
  if (account) {
    return account.balance
  }
  return 0
}

async function transferCpu(fromAccountName, toAccountName, amount) {
  const { contract, options } = await cpuContract.bind(this)(fromAccountName)
  await contract.transfer(fromAccountName, toAccountName, amount, options);
}

module.exports = {
  approveCpu,
  cpuContract,
  getCpuBalance,
  transferCpu
}
