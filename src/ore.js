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

function encryptKeys(keys, password) {
  this.encryptedWalletPassword = encrypt(keys.masterPrivateKey, password).toString()
  keys.masterPrivateKey = this.encryptedWalletPassword
  keys.privateKeys.owner = encrypt(keys.privateKeys.owner, password).toString()
  keys.privateKeys.active = encrypt(keys.privateKeys.active, password).toString()
}

async function createOreAccountWithKeys(ownerPublicKey, activePublicKey, oreAccountName = generateAccountName()) {
  // create a new user account on the ORE network with wallet and associate it with a user’s identity
  await this.eos.newaccount({
    creator: this.config.oreAuthAccountName,
    name: oreAccountName,
    owner: ownerPublicKey,
    active: activePublicKey
  })

  return oreAccountName
}

/* Public */

async function createOreAccount(password) {
  // Generate wallet => new wallet password -> encrypt with userWalletPassword => encryptedWalletPassword
  // TODO Check for existing wallets, for name collisions
  const keys = await Keygen.generateMasterKeys()
  const oreAccountName = await createOreAccountWithKeys.bind(this)(keys.publicKeys.owner, keys.publicKeys.active)

  encryptKeys.bind(this)(keys, password)

  return { oreAccountName, privateKeys: keys.privateKeys, publicKeys: keys.publicKeys }
}

async function createOreWallet(password, oreAccountName, encryptedAccountOwnerPrivateKey, encryptedAccountActivePrivateKey) {
  //Create EOS Wallet
  //userOreWalletName same as userOreAccountName

  //Decrypt encryptedAccountOwnerPrivateKey and encryptedAccountActivePrivateKey using userWalletPassword
  //Import both owner and acrtive keypairs (public and private)
  //Encrypt newWalletPassword with userAccountPassword => encryptedWalletPassword
  return { oreAccountName, encryptedWalletPassword }
}

async function getOreAccountContents(oreAccountName) {
  //const cpuBalance = this.getCpuBalance(oreAccountName)
  //const instruments = this.getInstruments(oreAccountName)
  const account = await this.eos.getAccount(oreAccountName)

  return account
  //return { cpuBalance, instruments }
}

async function unlockOreWallet(name, password) {
  return [] // keys
}

module.exports = {
  createOreAccount,
  createOreWallet,
  getOreAccountContents,
  unlockOreWallet
}
