const {Keystore, Keygen} = require('eosjs-keygen')
const base32 = require('base32.js')
const CryptoJS = require("crypto-js");

const ACCOUNT_NAME_MAX_LENGTH = 12

/* Private */

function generateAccountName(encoding = {type: 'rfc4648', lc: true}){
  // account names are generated based on the current unix timestamp
  // account names MUST be base32 encoded, and be < 13 characters, in compliance with the EOS standard
  // encoded timestamps are trimmed from the left, to retain enough randomness for multiple per second
  const encoder = new base32.Encoder(encoding);
  const timestamp = Date.now().toString()
  const buffer = Buffer.from(timestamp)
  const encodedTimestamp = encoder.write(buffer).finalize();
  const idx = encodedTimestamp.length - ACCOUNT_NAME_MAX_LENGTH

  return encodedTimestamp.substr(idx, ACCOUNT_NAME_MAX_LENGTH)
}

function encrypt(unencrypted, password) {
  let encrypted = CryptoJS.AES.encrypt(unencrypted, password);

  return encrypted
}

function decrypt(encrypted, password) {
  let bytes = CryptoJS.AES.decrypt(encrypted.toString(), password);
  let unencrypted = bytes.toString(CryptoJS.enc.Utf8);

  return unencrypted
}

/* Public */

async function createOreAccount(publicKey, oreAccountName = generateAccountName()) {
  // create a new user account on the ORE network with wallet and associate it with a user’s identity
  await this.eos.newaccount({
    creator: process.env.AUTH_ACCOUNT_NAME,
    name: oreAccountName,
    owner: publicKey,
    active: publicKey
  })

  return oreAccountName
}

async function createOreWallet(walletPassword) {
  // Generate wallet => new wallet password -> encrypt with userWalletPassword => encryptedWalletPassword
  // TODO Check for existing wallets, for name collisions
  const keys = await Keygen.generateMasterKeys()
  const oreAccountName = await createOreAccount.bind(this)(keys.publicKeys.active)

  this.encryptedWalletPassword = encrypt(keys.masterPrivateKey, walletPassword).toString()

  return {oreAccountName, encryptedWalletPassword: this.encryptedWalletPassword}
}

async function getOreAccount(oreAccountName) {
  //const cpuBalance = this.getCpuBalance(oreAccountName, walletName)
  //const instruments = this.getInstruments(oreAccountName)
  const account = await this.eos.getAccount(oreAccountName)

  return account
  //return [walletName, [cpuBalance, instruments]]
}

async function unlockOreWallet(walletPassword) {
  const masterPrivateKey = decrypt(this.encryptedWalletPassword, walletPassword).toString()
  const keys = Keygen.generateMasterKeys(masterPrivateKey)

  return keys
}

module.exports = {
  createOreAccount,
  createOreWallet,
  getOreAccount,
  unlockOreWallet
}
