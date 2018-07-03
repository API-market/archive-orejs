const CONTRACT_NAME = 'cpu.ore'

/* Public */

function cpuContract(accountName) {
  return this.contract(CONTRACT_NAME, accountName)
}

function approveCpu(fromAccountName, toAccountName, cpuAmount) {
  return this.approveTransfer(fromAccountName, toAccountName, cpuAmount, CONTRACT_NAME)
}

function getCpuBalance(oreAccountName) {
  return this.getBalance(oreAccountName, CONTRACT_NAME)
}

function transferCpu(fromAccountName, toAccountName, amount) {
  return this.transferToken(fromAccountName, toAccountName, amount, CONTRACT_NAME)
}

module.exports = {
  approveCpu,
  cpuContract,
  getCpuBalance,
  transferCpu
}
