const {orejs, walletPassword} = require("./index")

orejs.createOreAccount(walletPassword).then(account => {
  console.log("Account Created:", account)

  // Get the newly created EOS account...
  orejs.getOreAccountContents(account.oreAccountName).then(contents => {
    console.log("Account Contents:", contents)
  })
})
