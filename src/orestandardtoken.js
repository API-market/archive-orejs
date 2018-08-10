const TABLE_NAME = 'accounts';

/* Public */
function getAmount(tokenAmount, tokenSymbol) {
  try {
    if (typeof tokenAmount === 'number') {
      const amount = parseFloat(tokenAmount).toFixed(4);
      return `${amount.toString()} ${tokenSymbol}`;
    }
    if (typeof tokenAmount === 'string') {
      if (tokenAmount.split(' ')[1] === tokenSymbol) {
        return tokenAmount;
      }

      return `${parseFloat(tokenAmount).toFixed(4).toString()} ${tokenSymbol}`;
    }
    throw new Error('not a valid token amount');
  } catch (e) {
    return e;
  }
}

async function issueToken(toAccountName, tokenAmount, memo = '', ownerAccountName, contractName) {
  const {
    contract,
    options,
  } = await this.contract(contractName, ownerAccountName);
  await contract.issue(toAccountName, tokenAmount.toString(), memo, options);
}

// cleos push action cpu.ore approve '[""]
async function approveTransfer(fromAccountName, toAccountName, tokenAmount, contractName) {
  // Appprove some account to spend on behalf of approving account
  const {
    contract,
    options,
  } = await this.contract(contractName, fromAccountName);
  await contract.approve(fromAccountName, toAccountName, tokenAmount.toString(), options);
}

// cleos get currency balance cpu.ore test1.apim CPU
async function getBalance(accountName, tokenSymbol, contractName) {
  const balance = await this.eos.getCurrencyBalance(contractName, accountName, tokenSymbol);
  if (balance && balance[0]) {
    return parseFloat(balance[0].split(tokenSymbol)[0]);
  }
  return parseFloat(0.0000);
}

// cleos push action cpu.ore transfer '["test1.apim", "test2.apim", "10.0000 CPU", "memo"]' -p test1.apim
async function transferToken(fromAccountName, toAccountName, tokenAmount, memo = '', contractName) {
  // Standard token transfer
  const {
    contract,
    options,
  } = await this.contract(contractName, fromAccountName);
  await contract.transfer(fromAccountName, toAccountName, tokenAmount.toString(), memo, options);
}

// cleos push action cpu.ore transferFrom '["app.apim", "test1.apim", "test2.apim", "10.0000 CPU"]' -p app.apim
async function transferFrom(approvedAccountName, fromAccountName, toAccountName, tokenAmount, contractName) {
  // Standard token transfer
  const {
    contract,
    options,
  } = await this.contract(contractName, approvedAccountName);
  await contract.transferFrom(approvedAccountName, fromAccountName, toAccountName, tokenAmount.toString(), options);
}

module.exports = {
  approveTransfer,
  getAmount,
  getBalance,
  issueToken,
  transferToken,
  transferFrom,
};
