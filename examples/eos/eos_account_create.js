// Usage: $ node eos_account_create ore.ore EOS67x5WAA2YJVw5zzRpjFaKnkD4CTuUHp33XZWx3jaRS3sQDrtFQ EOS6TRSSMocnCvLWJCNr2c1GC9X3PQuq6bnMeug5KRyUhuBwTTnZi

const ecc = require('eosjs-ecc')

const oreAccountName = process.argv[2] // REQUIRED
const ownerPublicKey = process.argv[3] || ecc.privateToPublic(process.env.ORE_PAYER_ACCOUNT_KEY)
const activePublicKey = process.argv[4] || ownerPublicKey

const orejs = require("../index").orejs(process.env.ORE_PAYER_ACCOUNT_NAME, process.env.ORE_PAYER_ACCOUNT_KEY)

;(async function() {
  let bytes = 8192
  let stake_net_quantity = 1
  let stake_cpu_quantity = 1
  let transfer = 0
  let transaction = await orejs.eos.transaction(tr => {
    tr.newaccount({
      creator: orejs.config.orePayerAccountName,
      name: oreAccountName,
      owner: ownerPublicKey,
      active: activePublicKey
    })

    tr.buyrambytes({
      payer: orejs.config.orePayerAccountName,
      receiver: oreAccountName,
      bytes: bytes
    })

    tr.delegatebw({
      from: orejs.config.orePayerAccountName,
      receiver: oreAccountName,
      stake_net_quantity: `${stake_net_quantity}.0000 SYS`,
      stake_cpu_quantity: `${stake_cpu_quantity}.0000 SYS`,
      transfer: transfer
    })
  })

  console.log("Transaction:", transaction)
  process.exit(0)
})()
