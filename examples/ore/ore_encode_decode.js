const fs = require("fs")
let {crypto, walletPassword} = require("../index")

const USER = 'test2.apim'

;(async function() {
  let account = process.env.ORE_OWNER_ACCOUNT_NAME
  let privateKey = process.env.ORE_OWNER_ACCOUNT_KEY
  console.log("Account:", account)

  let encryptedKey = crypto.encrypt(privateKey, walletPassword).toString()
  console.log("Encrypted Key:", encryptedKey)

  let decryptedKey = crypto.decrypt(encryptedKey, walletPassword).toString()
  console.log("Decrypted Key Matches:", decryptedKey == privateKey)
})()
