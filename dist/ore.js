const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(((resolve) => { resolve(result.value); })).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  }));
};
const __generator = (this && this.__generator) || function (thisArg, body) {
  let _ = {
      label: 0, sent() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [],
    },
    f,
    y,
    t,
    g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError('Generator is already executing.');
    while (_) {
      try {
        if (f = 1, y && (t = y[op[0] & 2 ? 'return' : op[0] ? 'throw' : 'next']) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [0, t.value];
        switch (op[0]) {
          case 0: case 1: t = op; break;
          case 4: _.label++; return { value: op[1], done: false };
          case 5: _.label++; y = op[1]; op = [0]; continue;
          case 7: op = _.ops.pop(); _.trys.pop(); continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2]) _.ops.pop();
            _.trys.pop(); continue;
        }
        op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
// const ecc = require('eosjs-ecc')
const Keygen = require('eosjs-keygen').Keygen;
const base32 = require('base32.js');
const CryptoJS = require('crypto-js');

const ACCOUNT_NAME_MAX_LENGTH = 12;
/* Private */
function createOreAccountWithKeys(activePublicKey, ownerPublicKey, options) {
  if (options === void 0) { options = {}; }
  return __awaiter(this, void 0, void 0, function () {
    const _this = this;
    let oreAccountName,
      bytes,
      stake_net_quantity,
      stake_cpu_quantity,
      transfer;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          oreAccountName = options.oreAccountName || generateAccountName();
          bytes = options.bytes || 8192;
          stake_net_quantity = options.stake_net_quantity || 1;
          stake_cpu_quantity = options.stake_cpu_quantity || 1;
          transfer = options.transfer || 0;
          return [4 /* yield */, this.eos.transaction((tr) => {
            tr.newaccount({
              creator: _this.config.orePayerAccountName,
              name: oreAccountName,
              owner: ownerPublicKey,
              active: activePublicKey,
            });
            tr.buyrambytes({
              payer: _this.config.orePayerAccountName,
              receiver: oreAccountName,
              bytes,
            });
            tr.delegatebw({
              from: _this.config.orePayerAccountName,
              receiver: oreAccountName,
              stake_net_quantity: `${stake_net_quantity}.0000 SYS`,
              stake_cpu_quantity: `${stake_cpu_quantity}.0000 SYS`,
              transfer,
            });
          })];
        case 1:
          _a.sent();
          return [2 /* return */, oreAccountName];
      }
    });
  });
}
function encryptKeys(keys, password) {
  this.encryptedWalletPassword = encrypt(keys.masterPrivateKey, password).toString();
  keys.masterPrivateKey = this.encryptedWalletPassword;
  keys.privateKeys.owner = encrypt(keys.privateKeys.owner, password).toString();
  keys.privateKeys.active = encrypt(keys.privateKeys.active, password).toString();
}
function generateAccountName(encoding) {
  if (encoding === void 0) { encoding = { type: 'rfc4648', lc: true }; }
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
/* Public */
function createOreAccount(password, ownerPublicKey, options) {
  if (options === void 0) { options = {}; }
  return __awaiter(this, void 0, void 0, function () {
    let keys,
      oreAccountName;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /* yield */, Keygen.generateMasterKeys(),
          // TODO Check for existing wallets, for name collisions
        ];
        case 1:
          keys = _a.sent();
          return [4 /* yield */, createOreAccountWithKeys.bind(this)(keys.publicKeys.active, ownerPublicKey, options)];
        case 2:
          oreAccountName = _a.sent();
          encryptKeys.bind(this)(keys, password);
          return [2 /* return */, { oreAccountName, privateKey: keys.privateKeys.active, publicKey: keys.publicKeys.active }];
      }
    });
  });
}
function createOreWallet(password, oreAccountName, encryptedAccountOwnerPrivateKey, encryptedAccountActivePrivateKey) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, _a => [2 /* return */, { oreAccountName, encryptedWalletPassword }]);
  });
}
function decrypt(encrypted, password) {
  const bytes = CryptoJS.AES.decrypt(encrypted.toString(), password);
  const unencrypted = bytes.toString(CryptoJS.enc.Utf8);
  return unencrypted;
}
function encrypt(unencrypted, password) {
  const encrypted = CryptoJS.AES.encrypt(unencrypted, password);
  return encrypted;
}
function getOreAccountContents(oreAccountName) {
  return __awaiter(this, void 0, void 0, function () {
    let account;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4 /* yield */, this.eos.getAccount(oreAccountName)];
        case 1:
          account = _a.sent();
          return [2 /* return */, account,
            // return { cpuBalance, instruments }
          ];
      }
    });
  });
}
function unlockOreWallet(name, password) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, _a => [2 /* return */, []], // keys
    );
  });
}
module.exports = {
  createOreAccount,
  createOreWallet,
  decrypt,
  encrypt,
  getOreAccountContents,
  unlockOreWallet,
};
// # sourceMappingURL=ore.js.map
