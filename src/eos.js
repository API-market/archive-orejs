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

  var code = params.code;
  var scope = params.scope || params.code;
  var table = params.table;
  var page_size = params.page_size || 20;

  var resp = await this.eos.getTableRows({
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

  var more = true;
  var results = [];
  var page = 0;

  do{
    var result = await getTableRowsPage(params, page++);
    more = result.more;
    results = results.concat(result.rows);
  } while(more);

  return results;
}

async function getAllTableRowsFiltered(params, filter){
  var result = await getAllTableRows(params);

  return filterRows(result, filter);
}

function filterRows(rows, filter){
  if(!filter) rows;

  var result = [];

  for(var r in rows) {
    var row = rows[r];

    var fits_filter = true;

    if(typeof filter === 'function') {
      fits_filter = filter(row);
    } else {
      for (var f in filter) {
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
