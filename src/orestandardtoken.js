const TABLE_NAME = 'accounts'

/* Public */

// cleos push action cpu.ore approve '[""]
async function approveStandardTokenTransfer(fromAccountName, toAccountName, tokenAmount, contractName) {
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
  const { contract, options } = await this.contract(contractName, fromAccountName)
  await contract.transfer(fromAccountName, toAccountName, tokenAmount.toString(), memo, options);
}

module.exports = {
  approveStandardTokenTransfer,
  getStandardTokenBalance,
  transferStandardToken
}
