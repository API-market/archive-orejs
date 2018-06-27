const orejs = require("../index.js").orejs()

;(async function() {
  let vouchers = await orejs.getAllTableRowsFiltered({
    code: "instr.ore",
    table: "tokens",
  }, {owner: 'apiuser'})

  for (voucher of vouchers) {
    console.log("Voucher:", voucher)
    let signature = orejs.signVoucher(voucher)
    console.log("Signature:", signature)
  }
})()
