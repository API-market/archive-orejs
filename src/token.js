const TABLE_NAME = 'accounts';

/* Public */

async function approveTransfer(fromAccountName, toAccountName, tokenAmount, tokenName) {
  const {
    contract,
    options,
  } = await this.contract(tokenName, fromAccountName);
  await contract.approvemore(fromAccountName, toAccountName, tokenAmount, options);
}

async function getBalance(oreAccountName, tokenName) {
  const tableKey = this.tableKey(oreAccountName);
  const account = await this.findOne(tokenName, TABLE_NAME, tableKey);
  if (account) {
    return account.balance;
  }
  return 0;
}

async function transferToken(fromAccountName, toAccountName, amount, tokenName) {
  const {
    contract,
    options,
  } = await this.contract(tokenName, fromAccountName);
  await contract.transfer(fromAccountName, toAccountName, amount, options);
}


module.exports = {
  approveTransfer,
  getBalance,
  transferToken,
};
