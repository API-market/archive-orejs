const CONTRACT_NAME = 'token.ore';
const ORE_ORE_ACCOUNT_NAME = 'ore.ore';
const TOKEN_SYMBOL = 'ORE';
let amount;
/* Public */

function oreContract(accountName) {
  return this.contract(CONTRACT_NAME, accountName);
}

function issueOre(toAccountName, oreAmount, memo = '') {
  amount = this.getTokenAmount(oreAmount, TOKEN_SYMBOL);
  return this.issueStandardToken(toAccountName, amount, memo, ORE_ORE_ACCOUNT_NAME, CONTRACT_NAME);
}

function approveOre(fromAccountName, toAccountName, oreAmount) {
  amount = this.getTokenAmount(oreAmount, TOKEN_SYMBOL);
  return this.approveStandardTokenTransfer(fromAccountName, toAccountName, amount, CONTRACT_NAME);
}

function getOreBalance(oreAccountName) {
  return this.getStandardTokenBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME);
}

function transferOre(fromAccountName, toAccountName, oreAmount, memo = '') {
  amount = this.getTokenAmount(oreAmount, TOKEN_SYMBOL);
  return this.transferStandardToken(fromAccountName, toAccountName, amount, memo, CONTRACT_NAME);
}

function transferOrefrom(approvedAccountName, fromAccountName, toAccountName, oreAmount) {
  amount = this.getTokenAmount(oreAmount, TOKEN_SYMBOL);
  return this.transferfrom(approvedAccountName, fromAccountName, toAccountName, amount, CONTRACT_NAME);
}

module.exports = {
  issueOre,
  approveOre,
  oreContract,
  getOreBalance,
  transferOre,
  transferOrefrom,
};
