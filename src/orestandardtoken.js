const TABLE_NAME = 'accounts';
const ALLOWANCE_TABLE = 'allowances';

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
async function approveTransfer(fromAccountName, toAccountName, tokenAmount, memo = '', contractName) {
  // Appprove some account to spend on behalf of approving account
  const {
    contract,
    options,
  } = await this.contract(contractName, fromAccountName);
  await contract.approve(fromAccountName, toAccountName, tokenAmount.toString(), memo, options);
}

// cleos get table token.ore test1.apim allowances
async function getApprovedAccount(accountName, contractName) {
  // Returns all the accounts approved by the approving account
  const approvedAccounts = await this.eos.getTableRows({
    code: contractName,
    json: true,
    scope: accountName,
    table: ALLOWANCE_TABLE,
    limit: -1,
  });
  return approvedAccounts.rows;
}

async function getApprovedAmount(fromAccount, toAccount, tokenSymbol, contractName) {
  // Returns the amount approved by the fromAccount for toAccount
  let approvedAmount = 0;
  const approvedAccounts = await this.getApprovedAccount.bind(this)(fromAccount, contractName);
  approvedAccounts.filter((obj) => {
    if (obj.to === toAccount) {
      approvedAmount = obj.quantity;
    }
    return approvedAmount;
  });
  return this.getAmount(approvedAmount, tokenSymbol);
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
async function transferFrom(approvedAccountName, fromAccountName, toAccountName, tokenAmount, memo = '', contractName) {
  // Standard token transfer
  const {
    contract,
    options,
  } = await this.contract(contractName, approvedAccountName);
  await contract.transferFrom(approvedAccountName, fromAccountName, toAccountName, tokenAmount.toString(), memo, options);
}

module.exports = {
  approveTransfer,
  getAmount,
  getApprovedAccount,
  getApprovedAmount,
  getBalance,
  issueToken,
  transferToken,
  transferFrom,
};