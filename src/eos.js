const BigNumber = require("bignumber.js")
const ecc = require('eosjs-ecc')

/* Private */

function filterRows(rows, filter) {
  if (!filter) return rows

  let result = []

  function fitsFilter(filter, row) {
    let fits = true
    if (typeof filter === 'function') {
      fits = filter(row)
    } else if (typeof filter === 'object') {
      for (let f in filter) {
        if (filter[f] != row[f]) fits = false
      }
    } else {
      throw "filter must be a function or an object"
    }
    return fits
  }

  for (let r in rows) {
    let row = rows[r]

    let fits_filter = true

    if (filter instanceof Array) {
      for (let f in filter) {
        if (!filter[f]) continue
        fits_filter = fits_filter && fitsFilter(filter[f], row)
      }
    } else {
      fits_filter = fitsFilter(filter, row)
    }

    if (!fits_filter) continue

    result.push(rows[r])
  }

  return result
}

async function getTableRowsPage(params, lower_bound = 0, page_size = 20, json = true) {
  params = { ...params,
    json: json,
    lower_bound: params.lower_bound || lower_bound,
    scope: params.scope || params.code,
    limit: page_size,
    upper_bound: params.upper_bound
  }
  if (!params.upper_bound) delete params.upper_bound

  let resp = await this.eos.getTableRows(params)

  return resp;
}

/* Public */

// Find one row in a table
async function findOne(contractName, tableName, tableKey) {
  let results = await this.eos.getTableRows({
    code: contractName.toString(),
    json: true,
    limit: 1,
    lower_bound: tableKey.toString(),
    scope: contractName.toString(),
    table: tableName.toString(),
    upper_bound: tableKey.plus(1).toString()
  })
  return results.rows[0]
}

async function getAllTableRows(params, key_field="id") {
  let more = true
  let results = []
  let lower_bound = 0

  do {
    let result = await getTableRowsPage.bind(this)(params, lower_bound)
    more = result.more

    if (more) {
      let last_key_value = result.rows[result.rows.length - 1][key_field]

      //if it's an account_name convert it to its numeric representation
      if (isNaN(last_key_value)) {
        last_key_value = tableKey(last_key_value)
      }

      lower_bound = (new BigNumber(last_key_value)).plus(1).toFixed()
    }

    results = results.concat(result.rows)
  } while(more)

  return results
}

async function getAllTableRowsFiltered(params, filter, key_field="id") {
  let result = await getAllTableRows.bind(this)(params, key_field)

  return filterRows(result, filter)
}

function signVoucher(apiVoucher) {
  return ecc.sign(apiVoucher.id.toString(), this.config.keyProvider)
}

// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
  return new BigNumber(this.eos.format.encodeName(oreAccountName, false))
}

module.exports = {
  findOne,
  getAllTableRows,
  getAllTableRowsFiltered,
  signVoucher,
  tableKey,
}
