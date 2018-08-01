const BigNumber = require('bignumber.js');
const ecc = require('eosjs-ecc');

/* Private */

function filterRows(rows, filter) {
  if (!filter) return rows;

  const result = [];

  function fitsFilter(filters, row) {
    let fits = true;
    if (typeof filters === 'function') {
      fits = filters(row);
    } else if (typeof filters === 'object') {
      for (const f in filters) {
        if (filters[f] !== row[f]) fits = false;
      }
    } else {
      throw new Error('filter must be a function or an object');
    }
    return fits;
  }

  for (const r in rows) {
    const row = rows[r];

    let fitFilter = true;

    if (filter instanceof Array) {
      for (const f in filter) {
        if (!filter[f]) continue;
        fitFilter = fitFilter && fitsFilter(filter[f], row);
      }
    } else {
      fitFilter = fitsFilter(filter, row);
    }

    if (!fitFilter) continue;

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

/* Public */

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

// only good for tables with id key_field
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

async function signVoucher(apiVoucherId) {
  return ecc.sign(apiVoucherId.toString(), this.config.keyProvider[0]);
}

// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
  return new BigNumber(this.eos.format.encodeName(oreAccountName, false));
}

module.exports = {
  contract,
  findOne,
  getAllTableRows,
  getAllTableRowsFiltered,
  signVoucher,
  tableKey,
};
