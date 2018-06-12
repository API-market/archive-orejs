const {orejs, walletPassword} = require("./index")

orejs.createOreAccount(walletPassword).then(account => {
  console.log("Account Created:", account)

  // Create a wallet, and add the new account...
  orejs.createOreWallet(walletPassword, account.oreAccountName, account.privateKeys.owner, account.privateKeys.active).then(wallet => {
    console.log("Wallet:", wallet)

    orejs.unlockOreWallet(walletName, walletPassword).then(keys => {
      console.log("Wallet", walletName, "unlocked:", keys)
    })
  })
})
