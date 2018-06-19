const orejs = require("../index.js").orejs()

;(async function() {
  let result = await orejs.getAllTableRowsFiltered({
    code: "ore.instr",
    scope: "ore.instr", //optional, defaults to same value as code
    table: "tokens",
  }, {owner: 'apiuser'})
  console.log(result)
})()
