const orejs = require('../index.js').orejs();

(async function () {
  const allResults = await orejs.getAllTableRows({
    code: 'instr.ore',
    scope: 'instr.ore', // optional, defaults to same value as code
    table: 'tokens',
  });
  console.log(allResults);

  const filteredResults = await orejs.getAllTableRowsFiltered({
    code: 'instr.ore',
    table: 'tokens',
  }, { owner: 'apiuser' });
  console.log(filteredResults);

  const customKeyResults = await orejs.getAllTableRowsFiltered({
    code: 'instr.ore',
    table: 'accounts',
  }, null, 'owner');
  console.log(customKeyResults);
}());
