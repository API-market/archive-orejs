// Creates the default orejs accounts
// Along with the associated key pairs, which are then stored in a temp json file

// Usage: $ node ore/create_accounts

const fs = require('fs');
const { Keystore, Keygen } = require('eosjs-keygen');
let orejs = require('../index').orejs();

const contractDir = process.env.TOKEN_CONTRACT_DIR;

const WALLET_URL = 'http://localhost:8900';
const ACCOUNTS = {
  orejs: { keys: undefined },
  apiowner: { keys: undefined },
  apiuser: { keys: undefined },
  'cpu.ore': {
    keys: undefined,
    contractName: 'token_eos20',
  },
  'ore.ore': {
    keys: undefined,
    contractName: 'token_eos20',
  },
  'instr.ore': {
    keys: undefined,
    contractName: 'ore.instrument',
  },
  'rights.ore': {
    keys: undefined,
    contractName: 'ore.rights_registry',
  },
  'usagelog.ore': {
    keys: undefined,
    contractName: 'ore.usage_log',
  },
  'manager.apim': {
    keys: undefined,
    contractName: 'apim.manager',
  },
};
(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({});
  console.log('Connecting to chain:', info.chain_id, '...');
  process.env.CHAIN_ID = info.chain_id;

  // Reinitialize the orejs library, with the appropriate chain id...
  orejs = require('../index').orejs();

  let importKeysCommands = '';
  let deployContractsCommands = '';
  // Generate accounts with keys...
  for (accountName in ACCOUNTS) {
    try {
      const accountData = ACCOUNTS[accountName];
      accountData.keys = await Keygen.generateMasterKeys();

      await orejs.eos.newaccount({
        creator: orejs.config.orePayerAccountName,
        name: accountName,
        owner: accountData.keys.publicKeys.owner,
        active: accountData.keys.publicKeys.active,
      });

      importKeysCommands += `echo \"-------> Import keys for ${accountName}\" \n`;
      importKeysCommands += `cleos --wallet-url=${WALLET_URL} wallet import ${accountData.keys.privateKeys.owner} -n orejs\n`;
      importKeysCommands += `cleos --wallet-url=${WALLET_URL} wallet import ${accountData.keys.privateKeys.active} -n orejs\n\n`;
      if (accountData.contractName) {
        deployContractsCommands += `echo \"-------> Deploy contract for ${accountName}\" \n`;
        deployContractsCommands += `cleos --wallet-url=${WALLET_URL} set contract ${accountName} ${contractDir}/${accountData.contractName} -p ${accountName}@active\n`;
        deployContractsCommands += `cleos --wallet-url=${WALLET_URL} set abi ${accountName} ${contractDir}/${accountData.contractName}/${accountData.contractName}.abi -p ${accountName}@active\n\n`;
      }
    } catch (err) {
    }
  }

  fs.writeFileSync('./tmp/keys.json', JSON.stringify(ACCOUNTS));
  fs.writeFileSync('./tmp/import_keys.sh', importKeysCommands);
  fs.writeFileSync('./tmp/deploy_contracts.sh', deployContractsCommands);

  console.log('Accounts Created:', JSON.stringify(ACCOUNTS));
}());
