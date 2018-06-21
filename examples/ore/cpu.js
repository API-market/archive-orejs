const fs = require("fs")
let orejs = require("../index").orejs()

const FROM = 'apiuser'
const BROKER = 'orejs' // The account making the transaction
const TO = 'apiowner'
const CPU_CONTRACT_NAME = 'ore.cpu'

;(async function() {
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  // Read the most recently generated account names and keys from the temp json file...
  let accounts = JSON.parse(fs.readFileSync('./tmp/keys.json'))
  //console.log("Account Data:", JSON.stringify(accounts))

  let accountData = accounts[FROM]
  process.env.ORE_AUTH_ACCOUNT_KEY = accountData.keys.privateKeys.active
  process.env.ORE_AUTH_ACCOUNT_NAME = FROM

  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require("../index").orejs()

  let balance = await orejs.getCpuBalance(FROM)
  console.log(`${TO} balance:`, balance)
  console.log(`${FROM} balance:`, balance)

  orejs.approveCpu(FROM, BROKER, balance)

  accountData = accounts[BROKER]
  process.env.ORE_AUTH_ACCOUNT_KEY = accountData.keys.privateKeys.active
  process.env.ORE_AUTH_ACCOUNT_NAME = BROKER

  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require("../index").orejs()

  let options = {authorization: `${BROKER}@active`}
  let cpuContract = await orejs.eos.contract(CPU_CONTRACT_NAME, options)
  await cpuContract.transferfrom(BROKER, FROM, TO, balance, options)

  balance = await orejs.getCpuBalance(FROM)
  console.log(`${TO} balance:`, balance)
  console.log(`${FROM} balance:`, balance)
})()
