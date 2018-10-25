const BigNumber = require('bignumber.js');
const ecc = require('eosjs-ecc');
/* Private */

function contractOptions(accountName, permission = 'active') {
  return {
    authorization: `${accountName}@${permission}`,
  };
}

/* Public */

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

// NOTE: Use this to await for transactions to be added to a block
// Useful, when committing sequential transactions with inter-dependencies
// NOTE: This does NOT confirm that the transaction is irreversible, aka finalized
function awaitTransaction(func, blocksToCheck = 12, checkInterval = 400) {
  return new Promise(async (resolve, reject) => {
    // check the current head block num...
    const preCommitInfo = await this.eos.getInfo({});
    const preCommitHeadBlockNum = preCommitInfo.head_block_num;
    // make the transaction...
    const transaction = await func();
    // keep checking for the transaction in future blocks...
    let blockNumToCheck = preCommitHeadBlockNum + 1;
    let blockToCheck;
    const intConfirm = setInterval(async () => {
      blockToCheck = await this.eos.getBlock(blockNumToCheck);
      if (blockToCheck) {
        if (hasTransaction(blockToCheck, transaction.transaction_id)) {
          clearInterval(intConfirm);
          resolve(transaction);
        }
        blockNumToCheck += 1;
      }
      if (blockNumToCheck > preCommitHeadBlockNum + blocksToCheck) {
        clearInterval(intConfirm);
        reject(new Error(`Await Transaction Timeout: Waited for ${blocksToCheck} blocks ~(${blocksToCheck / 2} seconds) starting with block num: ${preCommitHeadBlockNum}. This does not mean the transaction failed just that the transaction wasn't found in a block before timeout`));
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
  awaitTransaction,
  contract,
  findOne,
  getAllTableRows,
  hasTransaction,
  tableKey,
  checkPubKeytoAccount,
};
