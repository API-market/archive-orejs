// Creates the default orejs accounts
// Along with the associated key pairs, which are then stored in a temp json file

// Usage: $ node ore/create_accounts

const fs = require("fs")
const {Keystore, Keygen} = require('eosjs-keygen')
let orejs = require("../index").orejs()

ACCOUNTS = {
  'orejs': {keys: undefined},
  'ore.cpu': {
    keys: undefined,
    contractDir: process.env.TOKEN_CONTRACT_DIR
  },
  'ore.ore': {
    keys: undefined,
    contractDir: process.env.TOKEN_CONTRACT_DIR
  }
}

;(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  // Reinitialize the orejs library, with the appropriate chain id...
  orejs = require("../index").orejs()

  let importKeysCommands = ''
  let deployContractsCommands = ''
  // Generate accounts with keys...
  for (accountName in ACCOUNTS) {
    try {
      console.log("Creating account:", accountName)
      let accountData = ACCOUNTS[accountName]
      accountData.keys = await Keygen.generateMasterKeys()

      await orejs.eos.newaccount({
        creator: orejs.config.oreAuthAccountName,
        name: accountName,
        owner: accountData.keys.publicKeys.owner,
        active: accountData.keys.publicKeys.active
      })

      importKeysCommands += `cleos wallet import ${accountData.keys.privateKeys.owner} -n orejs\n`
      importKeysCommands += `cleos wallet import ${accountData.keys.privateKeys.active} -n orejs\n\n`
      if (accountData.contractDir) {
        deployContractsCommands += `cleos set contract ${accountName} ${accountData.contractDir} -p ${accountName}@active\n`
        deployContractsCommands += `cleos set abi ${accountName} ${accountData.contractDir}/token_eos20.abi -p ${accountName}@active\n\n`
      }
    } catch(err) {
    }
  }

  fs.writeFileSync('./tmp/keys.json', JSON.stringify(ACCOUNTS))
  fs.writeFileSync(`./tmp/import_keys.sh`, importKeysCommands)
  fs.writeFileSync(`./tmp/deploy_contracts.sh`, deployContractsCommands)

  console.log("Accounts Created:", JSON.stringify(ACCOUNTS))
})()
