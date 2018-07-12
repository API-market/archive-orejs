// Creates a random EOS account, just like the marketplace does...
// Fund the new account
// Check the resource usage of the account

// Usage: $ node ore/account_create_random

const ecc = require('eosjs-ecc')
let {crypto} = require("../index")
let options, balance, cpuContract, instrContract, contents, orejs

async function connectAs(accountName, accountKey) {
  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require("../index").orejs(accountName, accountKey, process.env.ORE_OWNER_ACCOUNT_OWNER_KEY)
  console.log("Private Key:", accountKey)
  console.log("Public Key:", ecc.privateToPublic(accountKey))
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
    "creator":process.env.ORE_OWNER_ACCOUNT_NAME,
    "issuer":accountName,
    "api_name":`${accountName} : ${version}`,
    "additional_api_params":[
       {
        "name":"sla",
        "value":"high-availability"
       }
    ],
    "api_payment_model":"paypercall",
    "api_price_in_cpu":1,
    "license_price_in_cpu":0,
    "api_description":"returns an image feature vector for input image",
    "right_registry":{
       "right_name":"apimarket.manager.licenseApi",
       "urls":[
          {
             "url":"ore://manager.apim/action/licenseapi",
             "method":"post",
             "matches_params":[
                {
                   "name":"sla",
                   "value":"default"
                }
             ],
             "token_life_span":100,
             "is_default":1
          }
       ],
       "whitelist":[
        "app.apim"
       ]
    },
    "start_time":0,
    "end_time":0
  }
}

async function logInstrumentCount() {
  let instruments = await orejs.getAllTableRows({
    code: 'instr.ore',
    table: 'tokens',
  })

  console.log("Instruments Count:", instruments.length)
}

;(async function() {
  connectAs(process.env.ORE_PAYER_ACCOUNT_NAME, process.env.ORE_PAYER_ACCOUNT_KEY)

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
  console.log("Transfering", amount, "CPU from", process.env.ORE_OWNER_ACCOUNT_NAME, "to", account.oreAccountName)
  await cpuContract.transfer(process.env.ORE_OWNER_ACCOUNT_NAME, account.oreAccountName, amount, options)

  await logBalances(account)

  ///////////////////////
  // Publish an API... //
  ///////////////////////

  await connectAs(account.oreAccountName, crypto.decrypt(account.privateKey, "password"))

  logInstrumentCount()

  for (let a = 0; a < 3; a++) {
    await orejs.createOfferInstrument(process.env.ORE_OWNER_ACCOUNT_NAME, instrumentFor(account.oreAccountName))
  }

  logInstrumentCount()

  ///////////////////////
  // License an API... //
  ///////////////////////

  for (let a = 0; a < 3; a++) {
    try {
      let transaction = await orejs.createVoucherInstrument(process.env.ORE_OWNER_ACCOUNT_NAME, account.oreAccountName, 0)
      console.log("License Transaction:", transaction)
    } catch(err) {
      console.log(`Error: Licensing API:`, err)
    }
  }

  logInstrumentCount()

  const rights = await orejs.getAllTableRows({
    code: 'rights.ore',
    table: 'rights',
  })

  console.log("Rights:", rights)

  // Get the newly created EOS account...
  contents = await orejs.getOreAccountContents(account.oreAccountName)
  console.log("Account Contents:", contents)
})()
