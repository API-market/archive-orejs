const BigNumber = require('bignumber.js');
const ecc = require('eosjs-ecc');
/* Private */

// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
  return new BigNumber(this.eos.format.encodeName(oreAccountName, false));
}

function hasTransaction(block, transactionId) {
  if (block.transactions) {
    const result = block.transactions.find(transaction => transaction.trx.id === transactionId);
    if (result !== undefined) {
      return true;
    }
  }
  return false;
}

function contractOptions(accountName, permission = 'active') {
  return {
    authorization: `${accountName}@${permission}`,
  };
}

/* Public */

// eosjs only confirms that transactions have been accepted
// this confirms that the transaction has been written to the chain
// by checking block produced immediately after the transaction
async function confirmTransaction(func, blocksToCheck = 10, checkInterval = 500) {
  // make the transaction...
  const transaction = await func();
  // check the head block...
  let latestBlock = await this.getLatestBlock();
  const initialBlockId = latestBlock.block_num;
  if (hasTransaction(latestBlock, transaction.transaction_id)) {
    return transaction;
  }
  // check following blocks for the transaction id...
  return new Promise((resolve, reject) => {
    const intConfirm = setInterval(async () => {
      latestBlock = await this.getLatestBlock();
      if (hasTransaction(latestBlock, transaction.transaction_id)) {
        clearInterval(intConfirm);
        resolve(transaction);
      } else if (latestBlock.block_num >= initialBlockId + blocksToCheck) {
        clearInterval(intConfirm);
        reject(new Error('Transaction Confirmation Timeout'));
      }
    }, checkInterval);
  });
}

async function contract(contractName, accountName, permission = 'active') {
  const options = contractOptions(accountName, permission);
  const contract = await this.eos.contract(contractName, options);
  return {
    contract,
    options,
  };
}

// Find one row in a table
async function findOne(contractName, tableName, tableKey) {
  const results = await this.eos.getTableRows({
    code: contractName.toString(),
    json: true,
    limit: 1,
    lower_bound: tableKey.toString(),
    scope: contractName.toString(),
    table: tableName.toString(),
    upper_bound: tableKey.plus(1).toString(),
  });
  return results.rows[0];
}

async function getAllTableRows(params, key_field = 'id', json = true) {
  let results = [];
  const lowerBound = 0;
  // const upperBound = -1;
  const limit = -1;
  const parameters = {
    ...params,
    json,
    lower_bound: params.lower_bound || lowerBound,
    scope: params.scope || params.code,
    limit: params.limit || limit,
  };
  results = await this.eos.getTableRows(parameters);
  return results.rows;
}

async function getLatestBlock() {
  const info = await this.eos.getInfo({});
  const block = await this.eos.getBlock(info.head_block_num);
  return block;
}

// check if the publickey belongs to the account provided
async function checkPubKeytoAccount(account, publicKey) {
  const keyaccounts = await this.eos.getKeyAccounts(publicKey);
  const accounts = await keyaccounts.account_names;

  if (accounts.includes(account)) {
    return true;
  }
  return false;
}

module.exports = {
  confirmTransaction,
  contract,
  findOne,
  getAllTableRows,
  getLatestBlock,
  hasTransaction,
  tableKey,
  checkPubKeytoAccount,
};
