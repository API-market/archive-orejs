const CONTRACT_NAME = 'token.ore';
const ORE_CPU_ACCOUNT_NAME = 'cpu.ore';
const TOKEN_SYMBOL = 'CPU';
let amount;
/* Public */

function cpuContract(accountName) {
  return this.contract(CONTRACT_NAME, accountName);
}

function issueCpu(toAccountName, cpuAmount, memo = '') {
  amount = this.getAmount(cpuAmount, TOKEN_SYMBOL);
  return this.issueToken(toAccountName, amount, memo, ORE_CPU_ACCOUNT_NAME, CONTRACT_NAME);
}

function approveCpu(fromAccountName, toAccountName, cpuAmount) {
  amount = this.getAmount(cpuAmount, TOKEN_SYMBOL);
  return this.approveTransfer(fromAccountName, toAccountName, amount, CONTRACT_NAME);
}

function getCpuBalance(oreAccountName) {
  return this.getBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME);
}

function transferCpu(fromAccountName, toAccountName, cpuAmount, memo = '') {
  amount = this.getAmount(cpuAmount, TOKEN_SYMBOL);
  return this.transferToken(fromAccountName, toAccountName, amount, memo, CONTRACT_NAME);
}

function transferCpufrom(approvedAccountName, fromAccountName, toAccountName, cpuAmount) {
  amount = this.getAmount(cpuAmount, TOKEN_SYMBOL);
  return this.transferFrom(approvedAccountName, fromAccountName, toAccountName, amount, CONTRACT_NAME);
}

module.exports = {
  issueCpu,
  approveCpu,
  cpuContract,
  getCpuBalance,
  transferCpu,
  transferCpufrom,
};
