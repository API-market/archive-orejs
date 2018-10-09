// Creates a random EOS account, just like the marketplace does...
// Fund the new account
// Check the resource usage of the account

// Usage: $ node ore/account_create_random
const BigNumber = require('bignumber.js');
const ecc = require('eosjs-ecc');
const {
  crypto,
} = require('../index');

let options;
let balance;
let contents;
let orejs;

async function connectAs(accountName, accountKey) {
  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require('../index').orejs(accountName, accountKey);
  console.log('Private Key:', accountKey);
  console.log('Public Key:', ecc.privateToPublic(accountKey));
  options = {
    authorization: `${accountName}@active`,
  };
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

function instrumentFor(accountName, version = Math.random().toString()) {
  return {
    creator: process.env.ORE_OWNER_ACCOUNT_NAME,
    issuer: process.env.ORE_OFFER_ISSUER,
    security_type: 'pass',
    mutability: 1,
    api_params: [{
      right_name: 'apimarket.manager.licenseApi',
      api_name: 'cloud.hadron.imageRecognize',
      api_description: 'image recognition',
      api_price_in_cpu: '1.0000 CPU',
    }],
    additional_url_params: [],
    parameter_rules: [{
      type: 'default',
      values: [{
        name: 'api_security_type',
        value: 'permit',
      }, {
        name: 'api_payment_model',
        value: 'pay per call',
      }, {
        name: 'license_price_in_cpu',
        value: '0.0000 CPU',
      }],
    }],
    instrument_template: `cloud.hadron.contest-2018-07- ${Math.floor(Date.now() / 1000)}`,
    start_time: 0,
    end_time: 0,
    override_offer_id: 0,
  };
}

async function logInstrumentCount(tableKey) {
  const instruments = await orejs.getAllInstruments();

  console.log('Instruments Count:', instruments.length);
}

function delay(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}


(async function () {
  connectAs(process.env.ORE_PAYER_ACCOUNT_NAME, process.env.ORE_PAYER_ACCOUNT_KEY);

  // /////////////////////////
  // Create the account... //
  // /////////////////////////

  const ownerPublicKey = ecc.privateToPublic(process.env.ORE_OWNER_ACCOUNT_KEY);
  const activePublicKey = ecc.privateToPublic(process.env.ORE_OWNER_ACCOUNT_ACTIVE_KEY);
  const account = await orejs.createOreAccount(process.env.WALLET_PASSWORD, activePublicKey);
  console.log('Account Created:', account);

  // // Get the newly created EOS account...
  contents = await orejs.eos.getAccount(account.oreAccountName);
  console.log('Account Contents:', contents);

  // /////////////////////////////////////
  // Give the new account some tokens... //
  // ///////////////////////////////////////

  await connectAs(process.env.ORE_OWNER_ACCOUNT, process.env.ORE_OWNER_ACCOUNT_ACTIVE_KEY);

  await logBalances();

  const amount = 1.0000;
  const issueMemo = 'issue';
  const transferMemo = 'transfer';

  await logBalances();

  await connectAs(process.env.ORE_OWNER_ACCOUNT_NAME, process.env.ORE_OWNER_ACCOUNT_ACTIVE_KEY);
  console.log('Transfering', amount, 'CPU from', process.env.ORE_OWNER_ACCOUNT_NAME, 'to', account.oreAccountName);
  await orejs.transferCpu(process.env.ORE_OWNER_ACCOUNT_NAME, account.oreAccountName, amount);

  await logBalances(account.oreAccountName);

  // await connectAs(process.env.ORE_ORE_ACCOUNT_NAME, process.env.ORE_ORE_ACCOUNT_KEY)

  const debug = await orejs.findInstruments(account.oreAccountName);
  console.log('DEBUG:', debug);

  // console.log('transfer', amount, 'ORE to', account.oreAccountName);
  await orejs.transferOre(process.env.ORE_OWNER_ACCOUNT_NAME, account.oreAccountName, amount);

  // works only against local chain for now. New contract structure with "memo" not on staging yet
  await orejs.approveCpu(process.env.ORE_OWNER_ACCOUNT_NAME, account.oreAccountName, amount, 'approve transfer');
  await logBalances(account.oreAccountName);

  // ///////////////////////
  // // Publish an API... //
  // ///////////////////////

  await connectAs(account.oreAccountName, crypto.decrypt(account.privateKey, 'password'));

  logInstrumentCount();

  const instrument = instrumentFor(account.oreAccountName);

  await delay(3000);

  const offerTx = await orejs.createOfferInstrument(process.env.ORE_OWNER_ACCOUNT_NAME, instrument);

  await delay(3000);

  const [offer] = await orejs.findInstruments(process.env.ORE_OFFER_ISSUER);
  console.log('Offer:', offer, offer.instrument.rights);

  logInstrumentCount();

  // /////////////////////
  // License an API... //
  // /////////////////////

  const voucherTx = await orejs.createVoucherInstrument(process.env.ORE_OWNER_ACCOUNT_NAME, account.oreAccountName, offer.id, 0, '', false);

  await delay(3000);

  const [voucher] = await orejs.findInstruments(account.oreAccountName, true);
  console.log('Voucher:', voucher, voucher.instrument.rights);

  logInstrumentCount();

  // //////////////////
  // Call the API... //
  // //////////////////

  await connectAs(account.oreAccountName, crypto.decrypt(account.authVerifierPrivateKey, 'password'));

  const actions = await orejs.eos.getActions(account.oreAccountName);
  const [right] = voucher.instrument.rights;
  // works only against local chain for now. New contract structure with "memo" not on staging yet
  await orejs.approveCpu(account.oreAccountName, 'ore.verifier', right.price_in_cpu, 'approve verifier', 'authverifier');

  // // //////////////////////
  // // Get Usage Stats... //
  // // //////////////////////

  const rightName = voucher.instrument.rights[0].right_name;
  const instrumentStats = await orejs.getApiCallStats(voucher.id, rightName);
  console.log('Instrument Stats:', instrumentStats);
  const rightStats = await orejs.getRightStats(rightName, account.oreAccountName);
  console.log('Right Stats:', rightStats);
}());