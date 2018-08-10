const fs = require('fs');
let orejs = require('../index').orejs();

const FROM = 'apiuser';
const BROKER = 'orejs'; // The account making the transaction
const TO = 'apiowner';
const CPU_CONTRACT_NAME = 'cpu';
let accounts,
  cpuContract,
  options;

async function logBalances() {
  const balanceFrom = await orejs.getCpuBalance(FROM);
  const balanceTo = await orejs.getCpuBalance(TO);
  console.log(`${FROM} balance:`, balanceFrom);
  console.log(`${TO} balance:`, balanceTo);
}

async function connectAs(accountName) {
  const accountData = accounts[accountName];
  process.env.ORE_PAYER_ACCOUNT_KEY = accountData.keys.privateKeys.active;
  process.env.ORE_PAYER_ACCOUNT_NAME = accountName;

  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require('../index').orejs();

  const { contract, options } = await orejs.contract(CPU_CONTRACT_NAME, accountName);
  return contract;
}

(async function () {
  const info = await orejs.eos.getInfo({});
  console.log('Connecting to chain:', info.chain_id, '...');
  process.env.CHAIN_ID = info.chain_id;

  // Read the most recently generated account names and keys from the temp json file...
  accounts = JSON.parse(fs.readFileSync('./tmp/keys.json'));
  // console.log("Account Data:", JSON.stringify(accounts))

  // ////////////////////////////////////////
  // Mint some tokens to the FROM account //
  // ////////////////////////////////////////

  console.log('Minting...');

  await connectAs(CPU_CONTRACT_NAME);
  await cpuContract.mint(FROM, 1, options);

  await logBalances();

  // //////////////////////////////////////////////////////////////////
  // Approve the transfer BROKER to transfer tokens from FROM to TO //
  // //////////////////////////////////////////////////////////////////

  console.log('Approving...');

  await connectAs(FROM);
  await orejs.approveCpu(FROM, BROKER, 1, options);

  // ///////////////////////
  // Transfer the tokens //
  // ///////////////////////

  console.log('Transferring...');

  await connectAs(BROKER);
  await cpuContract.transferFrom(BROKER, FROM, TO, 1, options);

  logBalances();
}());
