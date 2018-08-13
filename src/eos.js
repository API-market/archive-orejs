const BigNumber = require('bignumber.js');
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
      const filterKeys = Object.keys(filter);
      filterKeys.forEach((key) => {
        if (filter[key] !== row[key]) {
          fits = false;
        }
      });
    } else {
      throw new Error('filter must be a function or an object');
    }
    return fits;
  }

  rows.forEach((row) => {
    let fitFilter = true;

    if (filter instanceof Array) {
      filter.forEach((f) => {
        if (f) {
          fitFilter = fitFilter && fitsFilter(f, row);
        }
      });
    } else {
      fitFilter = fitsFilter(filter, row);
    }
    if (fitFilter) {
      result.push(row);
    }
  });
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

async function getInstrumentsResult(params) {
  let keyType;
  let index;
  let results = [];
  const lowerBound = 0;
  const limit = -1;
  if (params.key_name === 'owner') {
    keyType = 'i64';
    index = 2;
  } else if (params.key_name === 'instrumentTemplate') {
    keyType = 'i64';
    index = 3;
  } else {
    // indexed by instrumentClass
    keyType = 'i64';
    index = 4;
  }
  const parameters = {
    ...params,
    json: true,
    lower_bound: params.lower_bound || lowerBound,
    scope: params.scope || params.code,
    limit: params.limit || limit,
    key_type: keyType,
    index_position: index,
  };
  results = await this.eos.getTableRows(parameters);
  return results.rows;
}
module.exports = {
  confirmTransaction,
  contract,
  findOne,
  getAllTableRows,
  getAllTableRowsFiltered,
  getLatestBlock,
  getInstrumentsResult,
  hasTransaction,
  tableKey,
};