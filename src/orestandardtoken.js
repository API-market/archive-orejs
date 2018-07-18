const TABLE_NAME = 'accounts'

/* Public */

async function issueStandardToken(toAccountName, tokenAmount, memo="", ownerAccountName, contractName) {
  const { contract, options } = await this.contract(contractName, ownerAccountName)
  await contract.issue(toAccountName, tokenAmount.toString(), memo, options)
}

// cleos push action cpu.ore approve '[""]
async function approveStandardTokenTransfer(fromAccountName, toAccountName, tokenAmount, contractName) {
  // Appprove some account to spend on behalf of approving account
  const { contract, options } = await this.contract(contractName, fromAccountName)
  await contract.approve(fromAccountName, toAccountName, tokenAmount.toString(), options)
}

// cleos get currency balance cpu.ore test1.apim CPU
async function getStandardTokenBalance(accountName, tokenSymbol, contractName) {
  const balance = await this.eos.getCurrencyBalance(contractName, accountName, tokenSymbol)
  if (balance){
    return parseFloat(balance[0].split(tokenSymbol)[0])
  }
  return parseFloat(0.0000)
}

// cleos push action cpu.ore transfer '["test1.apim", "test2.apim", "10.0000 CPU", "memo"]' -p test1.apim
async function transferStandardToken(fromAccountName, toAccountName, tokenAmount, memo="", contractName) {
  // Standard token transfer
  const { contract, options } = await this.contract(contractName, fromAccountName)
  await contract.transfer(fromAccountName, toAccountName, tokenAmount.toString(), memo, options);
}

// cleos push action cpu.ore transferfrom '["app.apim", "test1.apim", "test2.apim", "10.0000 CPU"]' -p app.apim
async function transferfrom(approvedAccountName, fromAccountName, toAccountName, tokenAmount,contractName) {
  // Standard token transfer
  console.log("in transfer fron", approvedAccountName)
  const { contract, options } = await this.contract(contractName, approvedAccountName)
  await contract.transferfrom(approvedAccountName, fromAccountName, toAccountName, tokenAmount.toString(), options);
}

module.exports = {
  approveStandardTokenTransfer,
  getStandardTokenBalance,
  issueStandardToken,
  transferStandardToken,
  transferfrom
}
