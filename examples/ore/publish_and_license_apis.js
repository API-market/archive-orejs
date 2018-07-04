// Mints token for all contracts listed in the keys.json file

// Usage: $ node ore/mint_tokens

const fs = require("fs")
const ecc = require("eosjs-ecc")
let orejs = require("../index").orejs()

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000
let accounts

async function connectAs(accountName, accountKey) {
  let accountData = accounts[accountName]
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
  
  let rights = {  
    "right_name": "hadronapi",
    "urls":[  
       {  
          "url":"www.hadron.com",
          "method":"post",
          "matches_params":[  
             {  
                "name":"sla",
                "value":"high-availability"
             }
          ],
          "token_life_span":100,
          "is_default":1
       }
    ],
    "issuer_whitelist":[  
       "app.apim"
    ]
 } 

  let instrument = {  
    "creator":"app.apim",
    "issuer":"test1.apim",
    "api_name":"hadronapi",
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

 //errors out with the error "cannot find abi" ; works fine when called with eosjs directly
await orejs.setRightsInRegistry(accountName, rights)

await connectAs(process.env.ORE_OWNER_ACCOUNT_NAME, process.env.ORE_OWNER_ACCOUNT_KEY)

//errors out with the error "cannot find abi" ; works fine when called with eosjs directly
await orejs.createOfferInstrument(process.env.ORE_OWNER_ACCOUNT_NAME, instrument)

//example offer id
const buyer = "test2.apim"
const offerId = 0

//errors out with the error "cannot find abi" ; works fine when called with eosjs directly
await orejs.createVoucherInstrument(process.env.ORE_OWNER_ACCOUNT_NAME, buyer, offerId)

//cleos get table instr.ore instr.ore tokens
  contractName = 'instr.ore'
  const instruments = await orejs.getAllTableRows({
    code: contractName,
    table: "tokens"
  })

  console.log("Instruments:", instruments)
})()
