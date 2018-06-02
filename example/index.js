const { Orejs } = require("../src")

const orejs = new Orejs({keyProvider: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"})
// Show all methods/properties...
//console.log(orejs)

// Confirm that we're connected to the EOS node...
//orejs.eos.getInfo({}).then(info => console.log(info))

// Create a new EOS wallet...
const walletPassword = 'hello'
orejs.createOreWallet(walletPassword).then(walletName => {
  console.log("Wallet Created:", walletName)

  // Get the newly created EOS wallet...
  orejs.getOreWallet(walletName).then(wallet => {
    console.log("Wallet:", wallet)
  })

  orejs.unlockOreWallet(walletPassword).then(keys => {
    console.log("Keys:", keys)
  })
})
