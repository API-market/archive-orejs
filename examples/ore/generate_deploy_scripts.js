// Creates the default orejs accounts
// Along with the associated key pairs, which are then stored in a temp json file

// Usage: $ node ore/create_accounts

const fs = require("fs")
const {Keystore, Keygen} = require('eosjs-keygen')
let orejs = require("../index").orejs()
const contractDir = process.env.TOKEN_CONTRACT_DIR

ACCOUNTS = {
  'orejs': {keys: undefined},
  'apiowner': {keys: undefined},
  'apiuser': {keys: undefined},
  'ore.cpu': {
    keys: undefined,
    contractName: 'token_eos20'
  },
  'ore.ore': {
    keys: undefined,
    contractName: 'token_eos20'
  },
  'ore.instr': {
    keys: undefined,
    contractName: 'ore.token_instrument'
  },
  'ore.rights': {
    keys: undefined,
    contractName: 'ore.rights_registry'
  },
  'ore.usagelog': {
    keys: undefined,
    contractName: 'ore.usage_log'
  },
  'apim.manager': {
    keys: undefined,
    contractName: 'apim.manager'
  },
}

;(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  // Reinitialize the orejs library, with the appropriate chain id...
  orejs = require("../index").orejs()
 
  let createAccountsCommands = ''
  let importKeysCommands = ''
  let deployContractsCommands = ''

  // Generate accounts with keys...
  for (accountName in ACCOUNTS) {
    try {
      console.log("-------> Creating account:", accountName)
      let accountData = ACCOUNTS[accountName]
      accountData.keys = await Keygen.generateMasterKeys()

      createAccountsCommands += `cleos create account ${orejs.config.oreAuthAccountName} ${accountName} ${accountData.keys.publicKeys.owner} ${accountData.keys.publicKeys.active}\n`

      importKeysCommands += `cleos wallet import ${accountData.keys.privateKeys.owner} -n orejs\n`
      importKeysCommands += `cleos wallet import ${accountData.keys.privateKeys.active} -n orejs\n\n`
      
      if (accountData.contractName) {
        console.log("-------> Will deploy contract:", accountData.contractName)
        deployContractsCommands += `cleos set contract ${accountName} ${contractDir}/${accountData.contractName} -p ${accountName}@active\n`
        deployContractsCommands += `cleos set abi ${accountName} ${contractDir}/${accountData.contractName}/${accountData.contractName}.abi -p ${accountName}@active\n\n`
      }
    } catch(err) {
    }
  }

  fs.writeFileSync('./tmp/keys.json', JSON.stringify(ACCOUNTS))
  fs.writeFileSync(`./tmp/step1_create_accounts.sh`, createAccountsCommands)
  fs.writeFileSync(`./tmp/step2_import_keys.sh`, importKeysCommands)
  fs.writeFileSync(`./tmp/step3_deploy_contracts.sh`, deployContractsCommands)

  console.log("Accounts Created:", JSON.stringify(ACCOUNTS))
})()
