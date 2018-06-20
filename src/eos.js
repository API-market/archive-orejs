const BigNumber = require("bignumber.js")

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

// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
  return new BigNumber(this.eos.format.encodeName(oreAccountName, false))
}

async function getTableRowsPage(params, page = 0, page_size = 20) {
  params = { ...params,
    json: params.json || true,
    lower_bound: params.lower_bound || page * page_size,
    scope: params.scope || params.code,
    upper_bound: params.upper_bound || ((page + 1) * page_size) + 1
  }
  let resp = await this.eos.getTableRows(params)

  return resp;
}

async function getAllTableRows(params) {
  let more = true
  let results = []
  let page = 0

  do {
    let result = await getTableRowsPage.bind(this)(params, page++)
    more = result.more
    results = results.concat(result.rows)
  } while(more)

  return results
}

async function getAllTableRowsFiltered(params, filter) {
  let result = await getAllTableRows.bind(this)(params)

  return filterRows(result, filter)
}

function filterRows(rows, filter) {
  if (!filter) return rows

  let result = []

  function fitsFilter(filter, row) {
    let fits = true
    if (typeof filter === 'function') {
      fits = filter(row)
    } else if(typeof filter === 'object') {
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

module.exports = {
  findOne,
  tableKey,
  getAllTableRows,
  getAllTableRowsFiltered,
}
