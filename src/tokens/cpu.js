const CONTRACT_NAME = 'cpu.ore'
const ORE_CPU_ACCOUNT_NAME = 'cpu.ore'
const TOKEN_SYMBOL = 'CPU'
/* Public */

function cpuContract(accountName) {
  return this.contract(CONTRACT_NAME, accountName)
}

function issueCpu(toAccountName, cpuAmount, memo=""){
  return this.issueStandardToken(toAccountName, cpuAmount, memo, ORE_CPU_ACCOUNT_NAME, CONTRACT_NAME)
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

function transferCpufrom(approvedAccountName, fromAccountName, toAccountName, cpuAmount){
  return this.transferfrom(approvedAccountName, fromAccountName, toAccountName, cpuAmount, CONTRACT_NAME)
}

module.exports = {
  issueCpu,
  approveCpu,
  cpuContract,
  getCpuBalance,
  transferCpu,
  transferCpufrom
}
