// Creates a random EOS account, just like the marketplace does...
// Fund the new account
// Check the resource usage of the account

// Usage: $ node ore/account_create_random

const ecc = require('eosjs-ecc')
let orejs = require("../index").orejs()
let options, balance, cpuContract, instrContract, contents

async function connectAs(accountName, accountKey) {
  process.env.ORE_PAYER_ACCOUNT_KEY = accountKey
  process.env.ORE_PAYER_ACCOUNT_NAME = accountName
  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require("../index").orejs()
  console.log("Private Key:", process.env.ORE_PAYER_ACCOUNT_KEY)
  console.log("Public Key:", ecc.privateToPublic(process.env.ORE_PAYER_ACCOUNT_KEY))
  options = {authorization: `${accountName}@active`}
  cpuContract = await orejs.eos.contract('cpu.ore', options)
  instrContract = await orejs.eos.contract('manager.apim', options)
}

async function logBalances(account = undefined) {
  balance = await orejs.getCpuBalance(process.env.ORE_CPU_ACCOUNT_NAME)
  console.log(process.env.ORE_CPU_ACCOUNT_NAME, "Balance:", balance)

  balance = await orejs.getCpuBalance(process.env.ORE_OWNER_ACCOUNT_NAME)
  console.log(process.env.ORE_OWNER_ACCOUNT_NAME, "Balance:", balance)

  if (account) {
    balance = await orejs.getCpuBalance(account.oreAccountName)
    console.log(account.oreAccountName, "Balance:", balance)
  }
}

function instrumentFor(accountName, version = Math.random().toString()) {
  return {
    apiName: `${accountName} : ${version}`,
    description: "this is a very good api",
    rights: [
      {
        "theright": {
          "right_name": "some_right_2",
          "price_in_cpu": 1,
          "issuer": accountName,
          "additional_url_params": [
            {
              "name": "sla",
              "value":"highAvailability"
            },
            {
              "name": "region",
              "value": "usWest"
            }
          ],
          "description": "Lol"
        },
        "urls": [
          {
            "url": "google.com",
            "method": "post",
            "matches_params": [{"name": "sla", "value":"highAvailability"},{"name":"region", "value":"usWest"}],
            "token_life_span": 100,
            "is_default": 1
          },
          {
            "url": "google.com",
            "method": "post",
            "matches_params": [{"name": "sla", "value":"highAvailability"},{"name":"region", "value":"usEast"}],
            "token_life_span": 100,
            "is_default": 0
          }
        ]
      }
    ]
  }
}

;(async function() {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  // Reinitialize the orejs library, with the appropriate chain id...
  orejs = require("../index").orejs()

  ///////////////////////////
  // Create the account... //
  ///////////////////////////

  const ownerPublicKey = ecc.privateToPublic(process.env.ORE_OWNER_ACCOUNT_KEY)

  let account = await orejs.createOreAccount(process.env.WALLET_PASSWORD, ownerPublicKey)
  console.log("Account Created:", account)

  // Get the newly created EOS account...
  contents = await orejs.getOreAccountContents(account.oreAccountName)
  console.log("Account Contents:", contents)

  /////////////////////////////////////////
  // Give the new account some tokens... //
  /////////////////////////////////////////

  await logBalances()

  const amount = 10
  await connectAs(process.env.ORE_CPU_ACCOUNT_NAME, process.env.ORE_CPU_ACCOUNT_KEY)
  console.log("Minting", amount, "CPU to", process.env.ORE_OWNER_ACCOUNT_NAME)
  await cpuContract.mint(process.env.ORE_CPU_ACCOUNT_NAME, amount, options)
  await cpuContract.transfer(process.env.ORE_CPU_ACCOUNT_NAME, process.env.ORE_OWNER_ACCOUNT_NAME, amount, options)

  await logBalances()

  await connectAs(process.env.ORE_OWNER_ACCOUNT_NAME, process.env.ORE_OWNER_ACCOUNT_KEY)
  console.log("Transfering", amount, "CPU from", process.env.ORE_PAYER_ACCOUNT_NAME, "to", account.oreAccountName)
  await cpuContract.transfer(process.env.ORE_PAYER_ACCOUNT_NAME, account.oreAccountName, amount, options)

  await logBalances(account)

  ///////////////////////
  // Publish an API... //
  ///////////////////////

  await connectAs(account.oreAccountName, orejs.decrypt(account.privateKey, "password"))


  for (let a = 0; a < 5; a++) {
    await orejs.saveInstrument(account.oreAccountName, instrumentFor(account.oreAccountName))
  }

  const offers = await orejs.getAllTableRows({
    code: 'manager.apim',
    table: 'offersdata',
  })

  console.log("Offers Count:", offers.length)

  ///////////////////////
  // License an API... //
  ///////////////////////

  await orejs.exerciseInstrument(account.oreAccountName, 0)

  const rights = await orejs.getAllTableRows({
    code: 'rights.ore',
    table: 'rights',
  })

  console.log("Rights:", rights)

  const instruments = await orejs.getAllTableRows({
    code: 'instr.ore',
    table: "tokens"
  })

  console.log("Instruments Count:", instruments.length)

  // Get the newly created EOS account...
  contents = await orejs.getOreAccountContents(account.oreAccountName)
  console.log("Account Contents:", contents)
})()
