// Mints token for all contracts listed in the keys.json file

// Usage: $ node ore/mint_tokens

const fs = require('fs');
let orejs = require('../index').orejs();

TOKENS = [
  'cpu.ore',
  'ore.ore',
];
(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({});
  console.log('Connecting to chain:', info.chain_id, '...');
  process.env.CHAIN_ID = info.chain_id;

  // Read the most recently generated account names and keys from the temp json file...
  const accounts = JSON.parse(fs.readFileSync('./tmp/keys.json'));
  // console.log("Account Data:", JSON.stringify(accounts))

  for (tokenName of TOKENS) {
    const accountData = accounts[tokenName];
    process.env.ORE_PAYER_ACCOUNT_KEY = accountData.keys.privateKeys.active;
    process.env.ORE_PAYER_ACCOUNT_NAME = tokenName;

    // Reinitialize the orejs library, with permissions for the current account...
    orejs = require('../index').orejs();

    const { contract, options } = await orejs.contract(tokenName, tokenName);
    // console.log("Contract:", contract)

    for (accountName in accounts) {
      console.log('Dispensing', tokenName, 'to', accountName);
      // Mint some tokens...
      await contract.mint(accountName, 1, options);

      // Print the results of our actions...
      const balance = await orejs.getCpuBalance(accountName);
      console.log('Account Balance:', balance);
    }
  }
}());
