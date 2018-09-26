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
var TABLE_NAME = 'accounts';
/* Public */
function getAmount(tokenAmount, tokenSymbol) {
    try {
        if (typeof tokenAmount === 'number') {
            var amount = parseFloat(tokenAmount).toFixed(4);
            return amount.toString() + " " + tokenSymbol;
        }
        if (typeof tokenAmount === 'string') {
            if (tokenAmount.split(' ')[1] === tokenSymbol) {
                return tokenAmount;
            }
            return parseFloat(tokenAmount).toFixed(4).toString() + " " + tokenSymbol;
        }
        throw new Error('not a valid token amount');
    }
    catch (e) {
        return e;
    }
}
function issueToken(toAccountName, tokenAmount, memo, ownerAccountName, contractName) {
    if (memo === void 0) { memo = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, contract, options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, this.contract(contractName, ownerAccountName)];
                case 1:
                    _a = _b.sent(), contract = _a.contract, options = _a.options;
                    return [4 /*yield*/, contract.issue(toAccountName, tokenAmount.toString(), memo, options)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// cleos push action cpu.ore approve '[""]
function approveTransfer(fromAccountName, toAccountName, tokenAmount, contractName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, contract, options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, this.contract(contractName, fromAccountName)];
                case 1:
                    _a = _b.sent(), contract = _a.contract, options = _a.options;
                    return [4 /*yield*/, contract.approve(fromAccountName, toAccountName, tokenAmount.toString(), options)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// cleos get currency balance cpu.ore test1.apim CPU
function getBalance(accountName, tokenSymbol, contractName) {
    return __awaiter(this, void 0, void 0, function () {
        var balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.eos.getCurrencyBalance(contractName, accountName, tokenSymbol)];
                case 1:
                    balance = _a.sent();
                    if (balance && balance[0]) {
                        return [2 /*return*/, parseFloat(balance[0].split(tokenSymbol)[0])];
                    }
                    return [2 /*return*/, parseFloat(0.0000)];
            }
        });
    });
}
// cleos push action cpu.ore transfer '["test1.apim", "test2.apim", "10.0000 CPU", "memo"]' -p test1.apim
function transferToken(fromAccountName, toAccountName, tokenAmount, memo, contractName) {
    if (memo === void 0) { memo = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, contract, options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, this.contract(contractName, fromAccountName)];
                case 1:
                    _a = _b.sent(), contract = _a.contract, options = _a.options;
                    return [4 /*yield*/, contract.transfer(fromAccountName, toAccountName, tokenAmount.toString(), memo, options)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// cleos push action cpu.ore transferFrom '["app.apim", "test1.apim", "test2.apim", "10.0000 CPU"]' -p app.apim
function transferFrom(approvedAccountName, fromAccountName, toAccountName, tokenAmount, contractName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, contract, options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, this.contract(contractName, approvedAccountName)];
                case 1:
                    _a = _b.sent(), contract = _a.contract, options = _a.options;
                    return [4 /*yield*/, contract.transferFrom(approvedAccountName, fromAccountName, toAccountName, tokenAmount.toString(), options)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    approveTransfer: approveTransfer,
    getAmount: getAmount,
    getBalance: getBalance,
    issueToken: issueToken,
    transferToken: transferToken,
    transferFrom: transferFrom,
};
//# sourceMappingURL=orestandardtoken.js.map