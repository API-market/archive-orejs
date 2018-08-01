// Creates a random EOS account, just like the marketplace does...
// Fund the new account
// Check the resource usage of the account

// Usage: $ node ore/account_create_random

const ecc = require('eosjs-ecc');
let orejs = require('../index').orejs();

let options,
  balance,
  cpuContract,
  instrContract,
  contents;

async function connectAs(accountName, accountKey) {
  process.env.ORE_PAYER_ACCOUNT_KEY = accountKey;
  process.env.ORE_PAYER_ACCOUNT_NAME = accountName;
  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require('../index').orejs();
  console.log('Private Key:', process.env.ORE_PAYER_ACCOUNT_KEY);
  console.log('Public Key:', ecc.privateToPublic(process.env.ORE_PAYER_ACCOUNT_KEY));
  options = { authorization: `${accountName}@active` };
  cpuContract = await orejs.eos.contract('cpu.ore', options);
  instrContract = await orejs.eos.contract('manager.apim', options);
}

async function logBalances(accountName = undefined) {
  balance = await orejs.getCpuBalance(process.env.ORE_CPU_ACCOUNT_NAME);
  console.log(process.env.ORE_CPU_ACCOUNT_NAME, 'Balance:', balance);

  balance = await orejs.getCpuBalance(process.env.ORE_OWNER_ACCOUNT_NAME);
  console.log(process.env.ORE_OWNER_ACCOUNT_NAME, 'Balance:', balance);

  if (accountName) {
    balance = await orejs.getCpuBalance(accountName);
    console.log(accountName, 'Balance:', balance);
  }
}

(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({});
  console.log('Connecting to chain:', info.chain_id, '...');
  process.env.CHAIN_ID = info.chain_id;

  // Reinitialize the orejs library, with the appropriate chain id...
  orejs = require('../index').orejs();

  // ///////////////////////////////////////
  // Give the new account some tokens... //
  // ///////////////////////////////////////

  const amount = 100;
  await connectAs(process.env.ORE_CPU_ACCOUNT_NAME, process.env.ORE_CPU_ACCOUNT_KEY);
  console.log('Minting', amount, 'CPU to', process.env.ORE_OWNER_ACCOUNT_NAME);
  await cpuContract.mint(process.env.ORE_CPU_ACCOUNT_NAME, amount, options);
  await orejs.transferCpu(process.env.ORE_CPU_ACCOUNT_NAME, process.env.ORE_OWNER_ACCOUNT_NAME, amount);

  await logBalances();

  oreAccountName = 'iztgojtge3ts';
  await connectAs(process.env.ORE_OWNER_ACCOUNT_NAME, process.env.ORE_OWNER_ACCOUNT_KEY);
  console.log('Transfering', amount, 'CPU from', process.env.ORE_PAYER_ACCOUNT_NAME, 'to', oreAccountName);
  await orejs.transferCpu(process.env.ORE_OWNER_ACCOUNT_NAME, oreAccountName, amount);

  await logBalances(oreAccountName);
}());
