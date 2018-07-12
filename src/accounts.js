const {Keygen} = require('eosjs-keygen')
const base32 = require('base32.js')

const ACCOUNT_NAME_MAX_LENGTH = 12

/* Private */

function newAccountTransaction(name, ownerPublicKey, activePublicKey, options = {}) {
  options = {bytes: 8192, stakedNet: 1, stakedCpu: 1, transfer: 0, ...options}

  return this.eos.transaction(tr => {
    tr.newaccount({
      creator: this.config.orePayerAccountName,
      name: name,
      owner: ownerPublicKey,
      active: activePublicKey
    })

    tr.buyrambytes({
      payer: this.config.orePayerAccountName,
      receiver: name,
      bytes: options.bytes
    })

    tr.delegatebw({
      from: this.config.orePayerAccountName,
      receiver: name,
      stake_net_quantity: `${options.stakedNet}.0000 SYS`,
      stake_cpu_quantity: `${options.stakedCpu}.0000 SYS`,
      transfer: options.transfer
    })
  })
}

async function createOreAccountWithKeys(activePublicKey, ownerPublicKey, options = {}, confirm = false) {
  let oreAccountName = options.oreAccountName || generateAccountName()
  let transaction
  if (confirm) {
    transaction = await this.confirmTransaction(() => {
      return newAccountTransaction.bind(this)(oreAccountName, ownerPublicKey, activePublicKey, options)
    })
  }

  transaction = await newAccountTransaction.bind(this)(oreAccountName, ownerPublicKey, activePublicKey, options)
  return {oreAccountName, transaction}
}

function encryptKeys(keys, password) {
  this.encryptedWalletPassword = this.encrypt(keys.masterPrivateKey, password).toString()
  keys.masterPrivateKey = this.encryptedWalletPassword
  keys.privateKeys.owner = this.encrypt(keys.privateKeys.owner, password).toString()
  keys.privateKeys.active = this.encrypt(keys.privateKeys.active, password).toString()
}

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

/* Public */

async function createOreAccount(password, ownerPublicKey, options = {}) {
  const keys = await Keygen.generateMasterKeys()
  // TODO Check for existing wallets, for name collisions
  const {oreAccountName, transaction} = await createOreAccountWithKeys.bind(this)(keys.publicKeys.active, ownerPublicKey, options)

  encryptKeys.bind(this)(keys, password)

  return { oreAccountName, privateKey: keys.privateKeys.active, publicKey: keys.publicKeys.active, transaction }
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
