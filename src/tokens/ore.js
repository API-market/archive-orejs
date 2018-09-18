const CONTRACT_NAME = 'token.ore';
const ORE_ORE_ACCOUNT_NAME = 'ore.ore';
const TOKEN_SYMBOL = 'ORE';
let amount;
/* Public */

function oreContract(accountName) {
  return this.contract(CONTRACT_NAME, accountName);
}

function issueOre(toAccountName, oreAmount, memo = '') {
  amount = this.getAmount(oreAmount, TOKEN_SYMBOL);
  return this.issueToken(toAccountName, amount, memo, ORE_ORE_ACCOUNT_NAME, CONTRACT_NAME);
}

async function approveOre(fromAccountName, toAccountName, oreAmount) {
  amount = this.getAmount(oreAmount, TOKEN_SYMBOL);
  const fromAccountBalance = await this.getOreBalance(fromAccountName, TOKEN_SYMBOL, CONTRACT_NAME);
  if (fromAccountBalance > 0) {
    return this.approveTransfer(fromAccountName, toAccountName, amount, CONTRACT_NAME);
  }
  throw new Error('The account does not have sufficient balance');
}

function getOreBalance(oreAccountName) {
  return this.getBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME);
}

function transferOre(fromAccountName, toAccountName, oreAmount, memo = '') {
  amount = this.getAmount(oreAmount, TOKEN_SYMBOL);
  return this.transferToken(fromAccountName, toAccountName, amount, memo, CONTRACT_NAME);
}

function transferOrefrom(approvedAccountName, fromAccountName, toAccountName, oreAmount) {
  amount = this.getAmount(oreAmount, TOKEN_SYMBOL);
  return this.transferFrom(approvedAccountName, fromAccountName, toAccountName, amount, CONTRACT_NAME);
}

module.exports = {
  issueOre,
  approveOre,
  oreContract,
  getOreBalance,
  transferOre,
  transferOrefrom,
};