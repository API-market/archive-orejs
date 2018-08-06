// Usage: $ node eos_contract_create ore.ore ~/Aikon/ore-protocol/contracts/token_eos20/token_eos20 5KbgRYtUUWK8qDV5hQYAzupMziBsDQgW4iAvwqAtkoKUn

const fs = require('fs');

const accountName = process.argv[2];
const contractDir = process.argv[3];
const accountKey = process.argv[4];

process.env.ORE_PAYER_ACCOUNT_KEY = accountKey;
process.env.ORE_PAYER_ACCOUNT_NAME = accountName;

const { orejs } = require('./index');

(async function () {
  wasm = fs.readFileSync(`${contractDir}.wasm`);
  abi = fs.readFileSync(`${contractDir}.abi`);

  // Publish contract to the blockchain
  const code = await orejs.eos.setcode(accountName, 0, 0, wasm); // @returns {Promise}
  // TODO Figure out why using a contract ABI's published via eosjs does not work,
  // However, contracts published via cleos seem to work just fine
  // https://github.com/EOSIO/eosjs/issues/110
  // let abi = await orejs.eos.setabi(accountName, JSON.parse(abi)) // @returns {Promise}
}());
