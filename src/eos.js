const BigNumber = require('bignumber.js');
const ecc = require('eosjs-ecc');

/* Private */

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

async function getTableRowsPage(params, lower_bound = 0, page_size = -1, json = true) {
  params = {
    ...params,
    json,
    lower_bound: params.lower_bound || lower_bound,
    scope: params.scope || params.code,
    limit: page_size,
    upper_bound: params.upper_bound,
  };
  if (!params.upper_bound) delete params.upper_bound;

  const resp = await this.eos.getTableRows(params);

  return resp;
}

async function keyProvider() {
  if (this.config.keyProvider instanceof Array) {
    return this.config.keyProvider[0];
  }
  return this.config.keyProvider;
}

/* Public */

// eosjs only confirms that transactions have been accepted
// this confirms that the transaction has been written to the chain
// by checking block produced immediately after the transaction
async function confirmTransaction(func, blocksToCheck = 10, checkInterval = 200) {
  // before making the transaction, check the current block id...
  const latestBlock = await this.getLatestBlock();
  const initialBlockId = latestBlock.block_num;
  // make the transaction...
  const transaction = await func();
  // check blocks for the transaction id...
  return new Promise((resolve, reject) => {
    let currentBlockId = initialBlockId + 1;
    const intConfirm = setInterval(async () => {
      let latestBlock = await this.getLatestBlock();
      if (currentBlockId <= latestBlock.block_num) {
        if (currentBlockId != latestBlock.block_num) {
          latestBlock = this.eos.getBlock(currentBlockId);
        }
        currentBlockId += 1;
      }
      if (hasTransaction(latestBlock, transaction.transaction_id)) {
        clearInterval(intConfirm);
        resolve(transaction);
      } else if (latestBlock.block_num >= initialBlockId + blocksToCheck) {
        clearInterval(intConfirm);
        reject('Transaction Confirmation Timeout');
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

async function getAllTableRows(params, key_field = 'id') {
  let more = true;
  let results = [];
  let lower_bound = 0;

  do {
    const result = await getTableRowsPage.bind(this)(params, lower_bound);
    more = result.more;

    if (more) {
      let last_key_value = result.rows[result.rows.length - 1][key_field];

      // if it's an account_name convert it to its numeric representation
      if (isNaN(last_key_value)) {
        last_key_value = tableKey(last_key_value);
      }

      lower_bound = (new BigNumber(last_key_value)).plus(1).toFixed();
    }

    results = results.concat(result.rows);
  } while (more);

  return results;
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

function hasTransaction(block, transactionId) {
  if (block.transactions) {
    for (const trans of block.transactions) {
      if (trans.trx.id == transactionId) {
        return true;
      }
    }
  }
  return false;
}

async function signVoucher(apiVoucherId) {
  return ecc.sign(apiVoucherId.toString(), this.config.keyProvider[0]);
}

// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
  return new BigNumber(this.eos.format.encodeName(oreAccountName, false));
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
