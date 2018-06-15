// Usage: $ node eos_account_create ore.ore EOS67x5WAA2YJVw5zzRpjFaKnkD4CTuUHp33XZWx3jaRS3sQDrtFQ EOS6TRSSMocnCvLWJCNr2c1GC9X3PQuq6bnMeug5KRyUhuBwTTnZi

const {orejs} = require("./index")

const oreAccountName = process.argv[2]
const ownerPublicKey = process.argv[3]
const activePublicKey = process.argv[4] || ownerKey

;(async function() {
  const account = await orejs.eos.newaccount({
    creator: orejs.config.oreAuthAccountName,
    name: oreAccountName,
    owner: ownerPublicKey,
    active: activePublicKey
  })

  console.log("Account:", account)
  process.exit(0)
})()
