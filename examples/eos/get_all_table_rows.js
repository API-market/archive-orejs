const orejs = require("../index.js").orejs()

;(async function() {
  let allResults = await orejs.getAllTableRows({
    code: "ore.instr",
    scope: "ore.instr", //optional, defaults to same value as code
    table: "tokens",
  })
  console.log(allResults)

  let filteredResults = await orejs.getAllTableRowsFiltered({
    code: "ore.instr",
    table: "tokens",
  }, {owner: 'apiuser'})
  console.log(filteredResults)
})()
