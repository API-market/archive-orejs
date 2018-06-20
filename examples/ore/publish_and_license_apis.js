// Mints token for all contracts listed in the keys.json file

// Usage: $ node ore/mint_tokens

const fs = require("fs")
let orejs = require("../index").orejs()

const ONE_YEAR = 365 * 24 * 60 * 1000

;(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  let accounts = JSON.parse(fs.readFileSync('./tmp/keys.json'))

  //cleos push action apim.manager publishapi `[ "apiowner", "goodapi", ${OFFERS}]` -p apiowner@active
  let accountName = 'apiowner'
  let contractName = 'apim.manager'
  let accountData = accounts[accountName]

  process.env.ORE_AUTH_ACCOUNT_KEY = accountData.keys.privateKeys.active
  process.env.ORE_AUTH_ACCOUNT_NAME = accountName

  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require("../index").orejs()

  let instrument = {
    apiName: 'goodapi',
    description: "",
    rights: [
      {
        "theright": {
          "right_name": "some_right_2",
          "price_in_cpu": 10,
          "issuer": "apiowner",
          "additional_url_params": [
            {
              "name": "a",
              "value":"5"
            },
            {
              "name": "b",
              "value": "6"
            }
          ],
          "description": "Lol"
        },
        "urls": [
          {
            "url": "google.com",
            "matches_params": [],
            "token_life_span": 100,
            "is_default": 1
          }
        ]
      }
    ]
  }
  await orejs.saveInstrument(accountName, instrument)

  //cleos get table apim.manager apim.manager offers
  const offers = await orejs.getAllTableRows({
    code: contractName,
    table: 'offersdata',
  })

  console.log("Offers:", offers)

  //cleos push action apim.manager licenceapi '["apiuser", 1]' -p apiuser
  accountName = 'apiuser'
  accountData = accounts[accountName]

  process.env.ORE_AUTH_ACCOUNT_KEY = accountData.keys.privateKeys.active
  process.env.ORE_AUTH_ACCOUNT_NAME = accountName

  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require("../index").orejs()

  await orejs.exerciseInstrument(accountName, 1)

  //cleos get table ore.rights ore.rights rights
  contractName = 'ore.rights'
  const rights = await orejs.getAllTableRows({
    code: contractName,
    table: 'rights',
  })

  console.log("Rights:", rights)

  //cleos get table ore.instr ore.instr tokens
  contractName = 'ore.instr'
  const instruments = await orejs.getAllTableRows({
    code: contractName,
    table: "tokens"
  })

  console.log("Instruments:", instruments)
})()
