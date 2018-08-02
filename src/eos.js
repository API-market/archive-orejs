const BigNumber = require('bignumber.js');
const ecc = require('eosjs-ecc');
/* Private */

// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
  return new BigNumber(this.eos.format.encodeName(oreAccountName, false));
}

function filterRows(rows, filter) {
  if (!filter) return rows;

  const result = [];

  function fitsFilter(filter, row) {
    let fits = true;
    if (typeof filter === 'function') {
      fits = filter(row);
    } else if (typeof filter === 'object') {
      for (const f in filter) {
        if (filter[f] != row[f]) fits = false;
      }
    } else {
      throw 'filter must be a function or an object';
    }
    return fits;
  }

  for (const r in rows) {
    const row = rows[r];

    let fits_filter = true;

    if (filter instanceof Array) {
      for (const f in filter) {
        if (!filter[f]) continue;
        fits_filter = fits_filter && fitsFilter(filter[f], row);
      }
    } else {
      fits_filter = fitsFilter(filter, row);
    }

    if (!fits_filter) continue;

    result.push(rows[r]);
  }

  return result;
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

/* Public */

// eosjs only confirms that transactions have been accepted
// this confirms that the transaction has been written to the chain
// by checking block produced immediately after the transaction
async function confirmTransaction(func, blocksToCheck = 10, checkInterval = 200) {
  // before making the transaction, check the current block id...
  let latestBlock = await this.getLatestBlock();
  const initialBlockId = latestBlock.block_num;
  // make the transaction...
  const transaction = await func();
  // check blocks for the transaction id...
  return new Promise((resolve, reject) => {
    let currentBlockId = initialBlockId + 1;
    const intConfirm = setInterval(async () => {
      latestBlock = await this.getLatestBlock();
      if (currentBlockId <= latestBlock.block_num) {
        if (currentBlockId !== latestBlock.block_num) {
          latestBlock = this.eos.getBlock(currentBlockId);
        }
        currentBlockId += 1;
      }
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

async function contract(contractName, accountName) {
  const options = {
    authorization: `${accountName}@active`,
  };
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

async function getAllTableRowsFiltered(params, filter, key_field = 'id') {
  const result = await getAllTableRows.bind(this)(params, key_field);

  return filterRows(result, filter);
}

async function getLatestBlock() {
  const info = await this.eos.getInfo({});
  const block = await this.eos.getBlock(info.last_irreversible_block_num);
  return block;
}

async function signVoucher(apiVoucherId) {
  return ecc.sign(apiVoucherId.toString(), this.config.keyProvider[0]);
}

module.exports = {
  confirmTransaction,
  contract,
  findOne,
  getAllTableRows,
  getAllTableRowsFiltered,
  getLatestBlock,
  hasTransaction,
  signVoucher,
  tableKey,
};