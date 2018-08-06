const orejs = require('../index.js').orejs();

(async function () {
  const balance = await orejs.eos.getCurrencyBalance('eosio.token', 'app.apim', 'SYS');
  console.log('Balance:', balance);
  const voters = await orejs.eos.getTableRows({
    code: 'eosio', scope: 'eosio', table: 'voters', json: true, limit: 20,
  });
  // console.log("Voters:", voters)
  const del = await orejs.eos.getTableRows({
    code: 'eosio', scope: 'eosio', table: 'delband', json: true, limit: 20,
  });
  // console.log("Del:", del)
  const ram = await orejs.eos.getTableRows({
    code: 'eosio', scope: 'eosio', table: 'rammarket', json: true, limit: 20,
  });
  console.log('Ram:', ram);
  // delband
}());
