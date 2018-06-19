const BigNumber = require("bignumber.js")

// Find rows in a table
async function find(contractName, tableName, lowerBound, upperBound, limit = 1, json = true) {
  const records = await this.eos.getTableRows({
    code: contractName.toString(),
    json: json,
    limit: limit,
    lower_bound: lowerBound.toString(),
    scope: contractName.toString(),
    table: tableName.toString(),
    upper_bound: upperBound.toString()
  })
  return records.rows
}

// Find one row in a table
async function findOne(contractName, tableName, tableKey, json = true) {
  const rows = await this.find(contractName, tableName, tableKey, tableKey.plus(1), 1, json)
  return rows[0]
}

// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
  return new BigNumber(this.eos.format.encodeName(oreAccountName, false))
}

async function getTableRowsPage(params, page) {
  let code = params.code;
  let scope = params.scope || params.code;
  let table = params.table;
  let page_size = params.page_size || 20;

  let resp = await this.eos.getTableRows({
    code: code,
    scope: scope,
    table: table,
    lower_bound: page * page_size,
    upper_bount: ((page + 1) * page_size) + 1,
    json: true,
  });

  return resp;
}


async function getAllTableRows(params) {

  let more = true;
  let results = [];
  let page = 0;

  do{
    let result = await getTableRowsPage.bind(this)(params, page++);
    more = result.more;
    results = results.concat(result.rows);
  } while(more);

  return results;
}

async function getAllTableRowsFiltered(params, filter){
  let result = await getAllTableRows.bind(this)(params);

  return filterRows(result, filter);
}

function filterRows(rows, filter){
  if(!filter) return rows;

  let result = [];

  for(let r in rows) {
    let row = rows[r];

    let fits_filter = true;

    if(typeof filter === 'function') {
      fits_filter = filter(row);
    } else {
      for (let f in filter) {
        if (filter[f] != row[f]) fits_filter = false;
      }
    }

    if(!fits_filter) continue;

    result.push(rows[r]);
  }

  return result;
}


module.exports = {
  find,
  findOne,
  tableKey,
  getAllTableRows,
  getAllTableRowsFiltered,
}
