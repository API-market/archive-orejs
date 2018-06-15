// Creates a random EOS account, just like the marketplace does...

// Usage: $ node ore/account_create_random

let orejs = require("../index").orejs()

orejs.createOreAccount(process.env.WALLET_PASSWORD).then(account => {
  console.log("Account Created:", account)

  // Get the newly created EOS account...
  orejs.getOreAccountContents(account.oreAccountName).then(contents => {
    console.log("Account Contents:", contents)
  })
})
