const {
  Keygen,
} = require('eosjs-keygen');

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

function generateAccountName() {
  // NOTE: account names MUST be base32 encoded, and be < 13 characters, in compliance with the EOS standard
  // NOTE: account names can also contain only the following characters: a-z, 1-5, & '.' In regex: [a-z1-5\.]{1,12}
  // NOTE: account names are generated based on the current unix timestamp
  const timestamp32 = Date.now().toString(32);
  const timestampEos32 = timestamp32
    .replace(0, '.')
    .replace(6, 'w')
    .replace(7, 'x')
    .replace(8, 'y')
    .replace(9, 'z');
  return timestampEos32;
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
  const {
    permissions,
  } = account;

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
  const permName = 'authverifier';
  const perms = await appendPermission.bind(this)(oreAccountName, keys, permName);
  await this.eos.transaction((tr) => {
    perms.forEach((perm) => {
      tr.updateauth({
        account: oreAccountName,
        permission: perm.perm_name,
        parent: perm.parent,
        auth: perm.required_auth,
      }, {
        authorization: `${oreAccountName}@owner`,
      });
    });

    tr.linkauth({
      account: oreAccountName,
      code: 'token.ore',
      type: 'approve',
      requirement: permName,
    }, {
      authorization: `${oreAccountName}@owner`,
    });
  });
}

async function generateVerifierAuthKeys(oreAccountName) {
  const verifierAuthKeys = await Keygen.generateMasterKeys();
  await addAuthVerifierPermission.bind(this)(oreAccountName, [verifierAuthKeys.publicKeys.active]);
  return verifierAuthKeys;
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

  return {
    keys,
    oreAccountName,
    transaction,
  };
}

async function generateOreAccountAndEncryptedKeys(password, ownerPublicKey, options = {}) {
  const {
    keys,
    oreAccountName,
    transaction,
  } = await generateOreAccountAndKeys.bind(this)(ownerPublicKey, options);

  const encryptedKeys = await encryptKeys.bind(this)(keys, password);
  return {
    encryptedKeys,
    oreAccountName,
    transaction,
  };
}

/* Public */

async function createOreAccount(password, ownerPublicKey, options = {}) {
  const {
    encryptedKeys,
    oreAccountName,
    transaction,
  } = await generateOreAccountAndEncryptedKeys.bind(this)(password, ownerPublicKey, options);
  const verifierAuthKeys = await generateVerifierAuthKeys.bind(this)(oreAccountName);

  return {
    verifierAuthKey: verifierAuthKeys.privateKeys.active,
    verifierAuthPublicKey: verifierAuthKeys.publicKeys.active,
    oreAccountName,
    privateKey: encryptedKeys.privateKeys.active,
    publicKey: encryptedKeys.publicKeys.active,
    transaction,
  };
}

module.exports = {
  createOreAccount,
};
