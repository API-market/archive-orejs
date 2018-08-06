const dotenv = require('dotenv');
const Eos = require('eosjs');
const BigNumber = require('bignumber.js');
const ecc = require('eosjs-ecc');
const fs = require('fs');

let options,
  balance,
  cpuContract,
  insontract,
  contents,
  orejs;

async function connectAs(accountName, accountKey) {
  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require('./index').orejs(accountName, accountKey, process.env.ORE_OWNER_ACCOUNT_OWNER_KEY);
  console.log('Private Key:', accountKey);
  console.log('Public Key:', ecc.privateToPublic(accountKey));
  options = { authorization: `${accountName}@active` };
  cpuContract = await orejs.eos.contract('token.ore', options);
  instrContract = await orejs.eos.contract('manager.apim', options);
}

async function logBalances(account = undefined) {
  balance = await orejs.getCpuBalance(process.env.ORE_OWNER_ACCOUNT_NAME);
  console.log(process.env.ORE_OWNER_ACCOUNT_NAME, 'Balance:', balance);

  if (account) {
    balance = await orejs.getCpuBalance(account);
    console.log(account, 'Balance:', balance);
  }
}

(async function () {
  connectAs(process.env.ORE_PAYER_ACCOUNT_NAME, process.env.ORE_PAYER_ACCOUNT_KEY);
  const jsonObject = fs.readFileSync('/Users/surabhilodha/Downloads/marketplace-prod.walletAccounts.json');
  console.log(jsonObject);
  await logBalances();
}());
