const fs = require("fs")
let orejs = require("../index").orejs()

const USER = 'a4tcmbvgeyta'
const CPU_CONTRACT_NAME = 'cpu.ore'

;(async function() {
  const info = await orejs.eos.getInfo({})
  console.log("Connecting to chain:", info.chain_id, "...")
  process.env.CHAIN_ID = info.chain_id

  let balance = await orejs.getCpuBalance(USER)
  //let balance = await orejs.getOreAccountContents(USER)
  console.log(`${USER} balance:`, balance)
})()
