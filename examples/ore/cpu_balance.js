const fs = require('fs');
const orejs = require('../index').orejs();

const USER = 'y3tqnbxg44ta';
const CPU_CONTRACT_NAME = 'cpu.ore';
(async function () {
  const info = await orejs.eos.getInfo({});
  console.log('Connecting to chain:', info.chain_id, '...');
  process.env.CHAIN_ID = info.chain_id;

  const balance = await orejs.getCpuBalance(USER);
  console.log(`${USER} balance:`, balance);
}());
