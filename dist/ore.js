var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a = require('eosjs-keygen'), Keystore = _a.Keystore, Keygen = _a.Keygen;
var base32 = require('base32.js');
var CryptoJS = require("crypto-js");
var ACCOUNT_NAME_MAX_LENGTH = 12;
/* Private */
function generateAccountName(encoding) {
    if (encoding === void 0) { encoding = { type: 'rfc4648', lc: true }; }
    // account names are generated based on the current unix timestamp
    // account names MUST be base32 encoded, and be < 13 characters, in compliance with the EOS standard
    // encoded timestamps are trimmed from the left, to retain enough randomness for multiple per second
    var encoder = new base32.Encoder(encoding);
    var timestamp = Date.now().toString();
    var buffer = Buffer.from(timestamp);
    var encodedTimestamp = encoder.write(buffer).finalize();
    var idx = encodedTimestamp.length - ACCOUNT_NAME_MAX_LENGTH;
    return encodedTimestamp.substr(idx, ACCOUNT_NAME_MAX_LENGTH);
}
function encrypt(unencrypted, password) {
    var encrypted = CryptoJS.AES.encrypt(unencrypted, password);
    return encrypted;
}
function decrypt(encrypted, password) {
    var bytes = CryptoJS.AES.decrypt(encrypted.toString(), password);
    var unencrypted = bytes.toString(CryptoJS.enc.Utf8);
    return unencrypted;
}
function encryptKeys(keys, password) {
    this.encryptedWalletPassword = encrypt(keys.masterPrivateKey, password).toString();
    keys.masterPrivateKey = this.encryptedWalletPassword;
    keys.privateKeys.owner = encrypt(keys.privateKeys.owner, password).toString();
    keys.privateKeys.active = encrypt(keys.privateKeys.active, password).toString();
}
function createOreAccountWithKeys(ownerPublicKey, activePublicKey, oreAccountName) {
    if (oreAccountName === void 0) { oreAccountName = generateAccountName(); }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // create a new user account on the ORE network with wallet and associate it with a user’s identity
                return [4 /*yield*/, this.eos.newaccount({
                        creator: this.config.oreAuthAccountName,
                        name: oreAccountName,
                        owner: ownerPublicKey,
                        active: activePublicKey
                    })];
                case 1:
                    // create a new user account on the ORE network with wallet and associate it with a user’s identity
                    _a.sent();
                    return [2 /*return*/, oreAccountName];
            }
        });
    });
}
/* Public */
function createOreAccount(password) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, oreAccountName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Keygen.generateMasterKeys()];
                case 1:
                    keys = _a.sent();
                    return [4 /*yield*/, createOreAccountWithKeys.bind(this)(keys.publicKeys.owner, keys.publicKeys.active)];
                case 2:
                    oreAccountName = _a.sent();
                    encryptKeys.bind(this)(keys, password);
                    return [2 /*return*/, { oreAccountName: oreAccountName, privateKeys: keys.privateKeys, publicKeys: keys.publicKeys }];
            }
        });
    });
}
function createOreWallet(password, oreAccountName, encryptedAccountOwnerPrivateKey, encryptedAccountActivePrivateKey) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            //Create EOS Wallet
            //userOreWalletName same as userOreAccountName
            //Decrypt encryptedAccountOwnerPrivateKey and encryptedAccountActivePrivateKey using userWalletPassword
            //Import both owner and acrtive keypairs (public and private)
            //Encrypt newWalletPassword with userAccountPassword => encryptedWalletPassword
            return [2 /*return*/, { oreAccountName: oreAccountName, encryptedWalletPassword: encryptedWalletPassword }];
        });
    });
}
function getOreAccountContents(oreAccountName) {
    return __awaiter(this, void 0, void 0, function () {
        var account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.eos.getAccount(oreAccountName)];
                case 1:
                    account = _a.sent();
                    return [2 /*return*/, account
                        //return { cpuBalance, instruments }
                    ];
            }
        });
    });
}
function unlockOreWallet(name, password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, []]; // keys
        });
    });
}
module.exports = {
    createOreAccount: createOreAccount,
    createOreWallet: createOreWallet,
    getOreAccountContents: getOreAccountContents,
    unlockOreWallet: unlockOreWallet
};
