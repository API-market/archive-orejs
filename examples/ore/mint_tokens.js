// Mints token for all contracts listed in the keys.json file

// Usage: $ node ore/mint_tokens

const fs = require("fs")
let orejs = require("../index").orejs()

TOKENS = [
  'ore.cpu',
  'ore.ore'
]


;(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  // Read the most recently generated account names and keys from the temp json file...
  let accounts = JSON.parse(fs.readFileSync('./tmp/keys.json'))
  //console.log("Account Data:", JSON.stringify(accounts))

  for (tokenName of TOKENS) {
    let accountData = accounts[tokenName]
    process.env.ORE_AUTH_ACCOUNT_KEY = accountData.keys.privateKeys.active
    process.env.ORE_AUTH_ACCOUNT_NAME = tokenName

    // Reinitialize the orejs library, with permissions for the current account...
    orejs = require("../index").orejs()
    let options = {authorization: `${tokenName}@active`}

    const contract = await orejs.eos.contract(tokenName, options)
    //console.log("Contract:", contract)

    for (accountName in accounts) {
      console.log("Dispensing", tokenName, "to", accountName)
      // Mint some tokens...
      await contract.mint(accountName, 1, options)

      // Print the results of our actions...
      const table_key = orejs.tableKey(accountName)
      console.log("Retreiving account balance...", accountName, table_key.toString())
      const account = await orejs.findOne(tokenName, 'accounts', table_key)
      console.log("Account Balance:", account.balance)
    }
  }
})()
