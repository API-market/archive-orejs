const { Orejs } = require("../src")
const fs = require('fs')

const orejs = new Orejs({keyProvider: "5HzUYWY4nd9Lfe2EW6gnLffLUfKvNgPAPZsd5d7v9dU5wUr4xkw"})

// Error reading contract; https://github.com/EOSIO/eos/issues/3159
orejs.eos.contract('token.eos2').then(code => {
  console.log("Actions:", Object.keys(code))
  orejs.eos.getTableRows({
         scope: 'token.eos2',
         code: 'token.eos2',
         table: 'accounts',
         json: true
      }).then(accounts => {
    console.log("Accounts:", accounts)
  })
})
