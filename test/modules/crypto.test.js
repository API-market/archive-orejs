const dotenv = require("dotenv")
const { crypto } = require("../../src")

describe("encryption/decryption of private keys with wallet passwords", () => {
  let privateKey, walletPassword, encrypted

  beforeAll(() => {
    dotenv.config()

    privateKey = process.env.ORE_PAYER_ACCOUNT_KEY
    walletPassword = process.env.WALLET_PASSWORD
    encrypted = crypto.encrypt(privateKey, walletPassword)
  })

  test("returns an encrypted string", () => {
    expect(encrypted.toString()).toEqual(expect.not.stringContaining(privateKey))
  })

  test("returns the original privateKey", () => {
    const decrypted = crypto.decrypt(encrypted, walletPassword)
    expect(decrypted.toString()).toMatch(privateKey)
  })

  test("does not return privateKey with a bad password", () => {
    const badPassword = "BadPassword"
    const decrypted = crypto.decrypt(encrypted, badPassword)
    expect(decrypted.toString()).not.toMatch(privateKey)
  })
})
