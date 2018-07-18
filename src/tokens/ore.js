const CONTRACT_NAME = 'ore.ore'
const ORE_ORE_ACCOUNT_NAME = 'ore.ore'
const TOKEN_SYMBOL = 'ORE'
/* Public */

function oreContract(accountName) {
  return this.contract(CONTRACT_NAME, accountName)
}

function issueOre(toAccountName, oreAmount, memo=""){
  return this.issueStandardToken(toAccountName, oreAmount, memo, ORE_ORE_ACCOUNT_NAME, CONTRACT_NAME)
}

function approveOre(fromAccountName, toAccountName, oreAmount) {
  return this.approveStandardTokenTransfer(fromAccountName, toAccountName, oreAmount, CONTRACT_NAME)
}

function getOreBalance(oreAccountName) {
  return this.getStandardTokenBalance(oreAccountName, TOKEN_SYMBOL, CONTRACT_NAME)
}

function transferOre(fromAccountName, toAccountName, oreAmount, memo="") {
  return this.transferStandardToken(fromAccountName, toAccountName, oreAmount, memo, CONTRACT_NAME)
}

function transferOrefrom(approvedAccountName, fromAccountName, toAccountName, oreAmount){
  return this.transferfrom(approvedAccountName, fromAccountName, toAccountName, oreAmount, CONTRACT_NAME)
}

module.exports = {
  issueOre,
  approveOre,
  oreContract,
  getOreBalance,
  transferOre,
  transferOrefrom
}