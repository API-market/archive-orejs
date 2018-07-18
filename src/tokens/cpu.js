const CONTRACT_NAME = 'cpu.ore'
const TOKEN_SYMBOL = 'CPU'
/* Public */

function cpuContract(accountName) {
  return this.contract(CONTRACT_NAME, accountName)
}

function approveCpu(fromAccountName, toAccountName, cpuAmount) {
  return this.approveStandardTokenTransfer(fromAccountName, toAccountName, cpuAmount, CONTRACT_NAME)
}

function getCpuBalance(oreAccountName) {
  return this.getStandardTokenBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME)
}

function transferCpu(fromAccountName, toAccountName, cpuAmount, memo="") {
  return this.transferStandardToken(fromAccountName, toAccountName, cpuAmount, memo, CONTRACT_NAME)
}

module.exports = {
  approveCpu,
  cpuContract,
  getCpuBalance,
  transferCpu
}
