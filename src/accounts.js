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

async function encryptKeys(keys, password) {
  const encryptedKeys = keys;
  const encryptedWalletPassword = this.encrypt(keys.masterPrivateKey, password).toString();
  encryptedKeys.masterPrivateKey = encryptedWalletPassword;
  encryptedKeys.privateKeys.owner = this.encrypt(keys.privateKeys.owner, password).toString();
  encryptedKeys.privateKeys.active = this.encrypt(keys.privateKeys.active, password).toString();
  return encryptedKeys;
}

async function getAccountPermissions(oreAccountName) {
  const account = await this.eos.getAccount(oreAccountName);
  const permissions = JSON.parse(JSON.stringify(account.permissions));

  return permissions;
}

function weightedKey(key, weight = 1) {
  return {
    key,
    weight,
  };
}

function weightedKeys(keys, weight = 1) {
  return keys.map(key => weightedKey(key, weight));
}

function newPermissionDetails(keys, threshold = 1, weights = 1) {
  return {
    accounts: [],
    keys: weightedKeys.bind(this)(keys, weights),
    threshold,
    waits: [],
  };
}

function newPermission(keys, permName, parent = 'active', threshold = 1, weights = 1) {
  return {
    parent,
    perm_name: permName,
    required_auth: newPermissionDetails.bind(this)(keys, threshold, weights),
  };
}

async function appendPermission(oreAccountName, keys, permName, parent = 'active', threshold = 1, weights = 1) {
  const perms = await getAccountPermissions.bind(this)(oreAccountName);
  const newPerm = newPermission.bind(this)(keys, permName, parent, threshold, weights);

  perms.push(newPerm);
  return perms;
}

async function addAuthVerifierPermission(oreAccountName, keys) {
  const perms = await appendPermission.bind(this)(oreAccountName, keys, 'authverifier');
  await this.eos.transaction((tr) => {
    perms.forEach((perm) => {
      tr.updateauth({
        oreAccountName,
        permission: perm.perm_name,
        parent: perm.parent,
        auth: perm.required_auth,
      }, {
        authorization: `${oreAccountName}@owner`,
      });
    });
  });
}

async function generateAuthVerifierKeys(oreAccountName) {
  const keys = await Keygen.generateMasterKeys();
  //await addAuthVerifierPermission.bind(this)(oreAccountName, [keys.publicKeys.active]);
  return keys;
}

async function generateAuthVerifierEncryptedKeys(password, oreAccountName) {
  const authVerifierKeys = await generateAuthVerifierKeys.bind(this)(oreAccountName);
  const encryptedAuthVerifierKeys = await encryptKeys.bind(this)(authVerifierKeys, password);
  return encryptedAuthVerifierKeys;
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

async function generateOreAccountAndKeys(ownerPublicKey, options = {}) {
  const keys = await Keygen.generateMasterKeys();

  // TODO Check for existing wallets, for name collisions
  const {
    oreAccountName,
    transaction,
  } = await createOreAccountWithKeys.bind(this)(keys.publicKeys.active, ownerPublicKey, options);

  return { keys, oreAccountName, transaction };
}

async function generateOreAccountAndEncryptedKeys(password, ownerPublicKey, options = {}) {
  const {
    keys,
    oreAccountName,
    transaction,
  } = await generateOreAccountAndKeys.bind(this)(ownerPublicKey, options);

  const encryptedKeys = await encryptKeys.bind(this)(keys, password);
  return { encryptedKeys, oreAccountName, transaction };
}

/* Public */

async function createOreAccount(password, ownerPublicKey, options = {}) {
  const {
    encryptedKeys,
    oreAccountName,
    transaction,
  } = await generateOreAccountAndEncryptedKeys.bind(this)(password, ownerPublicKey, options);
  const authVerifierEncryptedKeys = await generateAuthVerifierEncryptedKeys.bind(this)(password, oreAccountName);

  return {
    authVerifierPublicKey: authVerifierEncryptedKeys.publicKeys.active,
    authVerifierPrivateKey: authVerifierEncryptedKeys.privateKeys.active,
    oreAccountName,
    privateKey: encryptedKeys.privateKeys.active,
    publicKey: encryptedKeys.publicKeys.active,
    transaction,
  };
}

module.exports = {
  createOreAccount,
};
