const {Keystore, Keygen} = require('eosjs-keygen')
const base32 = require('base32.js')

const ACCOUNT_NAME_MAX_LENGTH = 12

function generateAccountName(encoding = {type: 'rfc4648', lc: true}){
  // account names are generated based on the current unix timestamp
  // account names MUST be base32 encoded, and be > 13 characters, in compliance with the EOS standard
  // encoded timestamps are trimmed from the left, to retain enough randomness for multiple per second
  const encoder = new base32.Encoder(encoding);
  const timestamp = Date.now().toString()
  const buffer = Buffer.from(timestamp)
  const encodedTimestamp = encoder.write(buffer).finalize();
  const idx = encodedTimestamp.length - ACCOUNT_NAME_MAX_LENGTH
  return encodedTimestamp.substr(idx, ACCOUNT_NAME_MAX_LENGTH)
}

async function createOreAccount(publicKey, oreAccountName = generateAccountName()) {
  // create a new user account on the ORE network with wallet and associate it with a user’s identity
  await this.eos.newaccount({
    creator: 'eosio',
    name: oreAccountName,
    owner: publicKey,
    active: publicKey
  })

  return oreAccountName
}

async function createOreWallet(walletPassword) {
  // Generate wallet => new wallet password -> encrypt with userWalletPassword => encryptedWalletPassword
  const keys = await Keygen.generateMasterKeys()
  const oreAccountName = await createOreAccount.bind(this)(keys.publicKeys.active)

  return oreAccountName
}

async function getOreWallet(oreAccountName, walletName = 'default') {
  //const cpuBalance = this.getCpuBalance(oreAccountName, walletName)
  //const instruments = this.getInstruments(oreAccountName)
  const account = await this.eos.getAccount(oreAccountName)

  return account
  //return [walletName, [cpuBalance, instruments]]
}

function unlockWallet(walletPassword) {
  // Call eosjs.unlockWallet???? - This should not be necessary on EOS
}

module.exports = {
  createOreWallet,
  getOreWallet,
  unlockWallet
}
