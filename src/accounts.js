const {
  Keygen,
} = require('eosjs-keygen');
const base32 = require('base32.js');

const ACCOUNT_NAME_MAX_LENGTH = 12;

/* Private */

function newAccountTransaction(name, ownerPublicKey, activePublicKey, options = {}) {
  const option = {
    bytes: 8192,
    stakedNet: 1,
    stakedCpu: 1,
    transfer: 0,
    ...options,
  };

  return this.eos.transaction((tr) => {
    tr.newaccount({
      creator: this.config.orePayerAccountName,
      name,
      owner: ownerPublicKey,
      active: activePublicKey,
    });

    tr.buyrambytes({
      payer: this.config.orePayerAccountName,
      receiver: name,
      bytes: option.bytes,
    });

    tr.delegatebw({
      from: this.config.orePayerAccountName,
      receiver: name,
      stake_net_quantity: `${option.stakedNet}.0000 SYS`,
      stake_cpu_quantity: `${option.stakedCpu}.0000 SYS`,
      transfer: option.transfer,
    });
  });
}

function generateAccountName(encoding = {
  type: 'rfc4648',
  lc: true,
}) {
  // account names are generated based on the current unix timestamp
  // account names MUST be base32 encoded, and be < 13 characters, in compliance with the EOS standard
  // encoded timestamps are trimmed from the left, to retain enough randomness for multiple per second
  const encoder = new base32.Encoder(encoding);
  const timestamp = Date.now().toString();
  const buffer = Buffer.from(timestamp);
  const encodedTimestamp = encoder.write(buffer).finalize();
  const idx = encodedTimestamp.length - ACCOUNT_NAME_MAX_LENGTH;

  return encodedTimestamp.substr(idx, ACCOUNT_NAME_MAX_LENGTH);
}

async function createOreAccountWithKeys(activePublicKey, ownerPublicKey, options = {}, confirm = false) {
  const oreAccountName = options.oreAccountName || generateAccountName();
  let transaction;
  if (confirm) {
    transaction = await this.confirmTransaction(() => newAccountTransaction.bind(this)(oreAccountName, ownerPublicKey, activePublicKey, options));
  }

  transaction = await newAccountTransaction.bind(this)(oreAccountName, ownerPublicKey, activePublicKey, options);
  return {
    oreAccountName,
    transaction,
  };
}

async function encryptKeys(keys, password) {
  const encryptedKeys = keys;
  this.encryptedWalletPassword = this.encrypt(keys.masterPrivateKey, password).toString();
  encryptedKeys.masterPrivateKey = this.encryptedWalletPassword;
  encryptedKeys.privateKeys.owner = this.encrypt(keys.privateKeys.owner, password).toString();
  encryptedKeys.privateKeys.active = this.encrypt(keys.privateKeys.active, password).toString();
  return encryptedKeys;
}

/* Public */

async function createOreAccount(password, ownerPublicKey, options = {}) {
  const keys = await Keygen.generateMasterKeys();
  // TODO Check for existing wallets, for name collisions
  const {
    oreAccountName,
    transaction,
  } = await createOreAccountWithKeys.bind(this)(keys.publicKeys.active, ownerPublicKey, options);

  const encryptedKeys = await encryptKeys.bind(this)(keys, password);
  keys.masterPrivateKey = encryptKeys.masterPrivateKey;
  keys.privateKeys.owner = encryptedKeys.privateKeys.owner;
  keys.privateKeys.active = encryptedKeys.privateKeys.active;

  return {
    oreAccountName,
    privateKey: keys.privateKeys.active,
    publicKey: keys.publicKeys.active,
    transaction,
  };
}

module.exports = {
  createOreAccount,
};
