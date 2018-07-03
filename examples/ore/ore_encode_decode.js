const fs = require("fs")
let {orejs, walletPassword} = require("../index")

orejs = orejs()

const USER = 'apiowner'

;(async function() {
  let accounts = JSON.parse(fs.readFileSync('./tmp/keys.json'))
  let accountData = accounts[USER]
  console.log("Account Data:", accountData)

  let privateKey = accountData.keys.privateKeys.active
  let encryptedKey = orejs.encrypt(privateKey, walletPassword).toString()
  console.log("Encrypted Key:", encryptedKey)

  let decryptedKey = orejs.decrypt(encryptedKey, walletPassword).toString()
  console.log("Decrypted Key Matches:", decryptedKey == privateKey)
})()
