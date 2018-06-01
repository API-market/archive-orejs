const { Orejs } = require("../src")

const orejs = new Orejs({keyProvider: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"})
// Show all methods/properties...
//console.log(orejs)

// Confirm that we're connected to the EOS node...
//orejs.eos.getInfo({}).then(info => console.log(info))

// Create a new EOS wallet...
const walletName = orejs.createOreWallet('hello').then(walletName => {
  console.log("Wallet Created:", walletName)

  // Get the newly created EOS wallet...
  orejs.getOreWallet(walletName).then(account => {
    console.log("Wallet Keys:", account)
  })
})
