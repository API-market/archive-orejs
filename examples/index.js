const dotenv = require('dotenv');
const {
  Orejs,
  crypto,
} = require('../src');

dotenv.config();

function orejs(accountName, ...accountKeys) {
  console.log('Connected as', accountName, '@', process.env.ORE_NETWORK_URI);
  console.log(accountKeys);
  return new Orejs({
    httpEndpoint: process.env.ORE_NETWORK_URI,
    keyProvider: accountKeys,
    orePayerAccountName: process.env.ORE_PAYER_ACCOUNT_NAME,
    sign: true,
  });
}

module.exports = {
  orejs,
  crypto,
  walletPassword: process.env.WALLET_PASSWORD,
};
