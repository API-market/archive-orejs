// Mints token for all contracts listed in the keys.json file

// Usage: $ node ore/mint_tokens

const fs = require("fs")
const ecc = require("eosjs-ecc")
let orejs = require("../index").orejs()

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000
let accounts

async function connectAs(accountName, accountKey) {
  let accountData = accounts[accountName]
  //process.env.ORE_PAYER_ACCOUNT_KEY = accountData.keys.privateKeys.active
  //process.env.ORE_PAYER_ACCOUNT_KEY = orejs.decrypt('U2FsdGVkX18xLuKXqyqMx4ycZWUFiYVypgiKz/eKR7ifaxNx2ZG/yAs8s00sS8kdDYsJvWaRZbhxw1akVt7GVlT1Yg27u0EYyFjHpJwmDAI=', "password")
  //process.env.ORE_PAYER_ACCOUNT_KEY = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
  process.env.ORE_PAYER_ACCOUNT_KEY = accountKey
  process.env.ORE_PAYER_ACCOUNT_NAME = accountName
  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require("../index").orejs()
  console.log("Private Key:", process.env.ORE_PAYER_ACCOUNT_KEY)
  console.log("Public Key:", ecc.privateToPublic(process.env.ORE_PAYER_ACCOUNT_KEY))
}

;(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  accounts = JSON.parse(fs.readFileSync('./tmp/keys.json'))

  //cleos push action manager.apim publishapi `[ "apiowner", "goodapi", ${OFFERS}]` -p apiowner@active
  let accountName = process.env.ORE_TESTA_ACCOUNT_NAME
  let contractName = 'manager.apim'
  await connectAs(accountName, process.env.ORE_TESTA_ACCOUNT_KEY)

  let instrument = {
    apiName: 'exampleapi',
    description: "this is a very good api",
    rights: [
      {
        "theright": {
          "right_name": "some_right_2",
          "price_in_cpu": 10,
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

  await orejs.saveInstrument(accountName, instrument)

  //cleos get table manager.apim manager.apim offers
  const offers = await orejs.getAllTableRows({
    code: contractName,
    table: 'offersdata',
  })

  console.log("Offers:", offers)

  //cleos push action manager.apim licenceapi '["apiuser", 1]' -p apiuser
  accountName = process.env.ORE_TESTB_ACCOUNT_NAME
  await connectAs(accountName, process.env.ORE_TESTB_ACCOUNT_KEY)

  await orejs.exerciseInstrument(accountName, 0)

  //cleos get table rights.ore rights.ore rights
  contractName = 'rights.ore'
  const rights = await orejs.getAllTableRows({
    code: contractName,
    table: 'rights',
  })

  console.log("Rights:", rights)

  //cleos get table instr.ore instr.ore tokens
  contractName = 'instr.ore'
  const instruments = await orejs.getAllTableRows({
    code: contractName,
    table: "tokens"
  })

  console.log("Instruments:", instruments)
})()
