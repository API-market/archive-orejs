var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var Keygen = require('eosjs-keygen').Keygen;
var base32 = require('base32.js');
var ACCOUNT_NAME_MAX_LENGTH = 12;
/* Private */
function newAccountTransaction(name, ownerPublicKey, activePublicKey, options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var option = __assign({ bytes: 8192, stakedNet: 1, stakedCpu: 1, transfer: 0 }, options);
    return this.eos.transaction(function (tr) {
        tr.newaccount({
            creator: _this.config.orePayerAccountName,
            name: name,
            owner: ownerPublicKey,
            active: activePublicKey,
        });
        tr.buyrambytes({
            payer: _this.config.orePayerAccountName,
            receiver: name,
            bytes: option.bytes,
        });
        tr.delegatebw({
            from: _this.config.orePayerAccountName,
            receiver: name,
            stake_net_quantity: option.stakedNet + ".0000 SYS",
            stake_cpu_quantity: option.stakedCpu + ".0000 SYS",
            transfer: option.transfer,
        });
    });
}
function generateAccountName(encoding) {
    if (encoding === void 0) { encoding = {
        type: 'rfc4648',
        lc: true,
    }; }
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
function createOreAccountWithKeys(activePublicKey, ownerPublicKey, options, confirm) {
    if (options === void 0) { options = {}; }
    if (confirm === void 0) { confirm = false; }
    return __awaiter(this, void 0, void 0, function () {
        var oreAccountName, transaction;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oreAccountName = options.oreAccountName || generateAccountName();
                    if (!confirm) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.confirmTransaction(function () { return newAccountTransaction.bind(_this)(oreAccountName, ownerPublicKey, activePublicKey, options); })];
                case 1:
                    transaction = _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, newAccountTransaction.bind(this)(oreAccountName, ownerPublicKey, activePublicKey, options)];
                case 3:
                    transaction = _a.sent();
                    return [2 /*return*/, {
                            oreAccountName: oreAccountName,
                            transaction: transaction,
                        }];
            }
        });
    });
}
function encryptKeys(keys, password) {
    return __awaiter(this, void 0, void 0, function () {
        var encryptedKeys;
        return __generator(this, function (_a) {
            encryptedKeys = keys;
            this.encryptedWalletPassword = this.encrypt(keys.masterPrivateKey, password).toString();
            encryptedKeys.masterPrivateKey = this.encryptedWalletPassword;
            encryptedKeys.privateKeys.owner = this.encrypt(keys.privateKeys.owner, password).toString();
            encryptedKeys.privateKeys.active = this.encrypt(keys.privateKeys.active, password).toString();
            return [2 /*return*/, encryptedKeys];
        });
    });
}
/* Public */
function createOreAccount(password, ownerPublicKey, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var keys, _a, oreAccountName, transaction, encryptedKeys;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Keygen.generateMasterKeys()];
                case 1:
                    keys = _b.sent();
                    return [4 /*yield*/, createOreAccountWithKeys.bind(this)(keys.publicKeys.active, ownerPublicKey, options)];
                case 2:
                    _a = _b.sent(), oreAccountName = _a.oreAccountName, transaction = _a.transaction;
                    return [4 /*yield*/, encryptKeys.bind(this)(keys, password)];
                case 3:
                    encryptedKeys = _b.sent();
                    keys.masterPrivateKey = encryptKeys.masterPrivateKey;
                    keys.privateKeys.owner = encryptedKeys.privateKeys.owner;
                    keys.privateKeys.active = encryptedKeys.privateKeys.active;
                    return [2 /*return*/, {
                            oreAccountName: oreAccountName,
                            privateKey: keys.privateKeys.active,
                            publicKey: keys.publicKeys.active,
                            transaction: transaction,
                        }];
            }
        });
    });
}
module.exports = {
    createOreAccount: createOreAccount,
};
//# sourceMappingURL=accounts.js.map