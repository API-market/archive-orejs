const orejs = require('../index.js').orejs();

(async function () {
  const vouchers = await orejs.getAllTableRowsFiltered({
    code: 'instr.ore',
    table: 'tokens',
  }, { owner: 'apiuser' });

  for (voucher of vouchers) {
    console.log('Voucher:', voucher);
    const signature = orejs.signVoucher(voucher);
    console.log('Signature:', signature);
  }
}());
