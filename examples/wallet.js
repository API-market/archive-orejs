const {orejs, walletPassword} = require("./index")

orejs.createOreWallet(walletPassword).then(walletName => {
  console.log("Wallet Created:", walletName)

  // Get the newly created EOS wallet...
  orejs.getOreWallet(walletName).then(wallet => {
    console.log("Wallet:", wallet)
  })

  // Get newly created keys from the wallet
  orejs.unlockOreWallet(walletPassword).then(keys => {
    console.log("Keys:", keys)
  })
})
