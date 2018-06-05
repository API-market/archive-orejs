const {orejs, walletPassword} = require("./index")

orejs.createOreWallet(walletPassword).then(wallet => {
  console.log("Wallet Created:", wallet)

  // Get the newly created EOS wallet...
  orejs.getOreAccount(wallet.oreAccountName).then(account => {
    console.log("Account:", account)
  })

  // Get newly created keys from the wallet
  orejs.unlockOreWallet(walletPassword).then(keys => {
    console.log("Keys:", keys)
  })
})
