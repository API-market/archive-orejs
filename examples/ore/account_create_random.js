// Creates a random EOS account, just like the marketplace does...

// Usage: $ node ore/account_create_random

const ecc = require('eosjs-ecc')
let orejs = require("../index").orejs()

;(async function() {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  // Reinitialize the orejs library, with the appropriate chain id...
  orejs = require("../index").orejs()

  const ownerPublicKey = ecc.privateToPublic(process.env.ORE_PAYER_ACCOUNT_KEY)

  orejs.createOreAccount(process.env.WALLET_PASSWORD, ownerPublicKey).then(account => {
    console.log("Account Created:", account)

    // Get the newly created EOS account...
    orejs.getOreAccountContents(account.oreAccountName).then(contents => {
      console.log("Account Contents:", contents)
    })
  })
})()
