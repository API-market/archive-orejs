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
var BigNumber = require('bignumber.js');
/* Private */
// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
    return new BigNumber(this.eos.format.encodeName(oreAccountName, false));
}
function hasTransaction(block, transactionId) {
    if (block.transactions) {
        var result = block.transactions.find(function (transaction) { return transaction.trx.id === transactionId; });
        if (result !== undefined) {
            return true;
        }
    }
    return false;
}
/* Public */
// eosjs only confirms that transactions have been accepted
// this confirms that the transaction has been written to the chain
// by checking block produced immediately after the transaction
function confirmTransaction(func, blocksToCheck, checkInterval) {
    if (blocksToCheck === void 0) { blocksToCheck = 10; }
    if (checkInterval === void 0) { checkInterval = 200; }
    return __awaiter(this, void 0, void 0, function () {
        var latestBlock, initialBlockId, transaction;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.getLatestBlock()];
                case 1:
                    latestBlock = _a.sent();
                    initialBlockId = latestBlock.block_num;
                    return [4 /*yield*/, func()];
                case 2:
                    transaction = _a.sent();
                    // check blocks for the transaction id...
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var currentBlockId = initialBlockId + 1;
                            var intConfirm = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getLatestBlock()];
                                        case 1:
                                            latestBlock = _a.sent();
                                            if (currentBlockId <= latestBlock.block_num) {
                                                if (currentBlockId !== latestBlock.block_num) {
                                                    latestBlock = this.eos.getBlock(currentBlockId);
                                                }
                                                currentBlockId += 1;
                                            }
                                            if (hasTransaction(latestBlock, transaction.transaction_id)) {
                                                clearInterval(intConfirm);
                                                resolve(transaction);
                                            }
                                            else if (latestBlock.block_num >= initialBlockId + blocksToCheck) {
                                                clearInterval(intConfirm);
                                                reject(new Error('Transaction Confirmation Timeout'));
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, checkInterval);
                        })];
            }
        });
    });
}
function contract(contractName, accountName) {
    return __awaiter(this, void 0, void 0, function () {
        var options, contract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        authorization: accountName + "@active",
                    };
                    return [4 /*yield*/, this.eos.contract(contractName, options)];
                case 1:
                    contract = _a.sent();
                    return [2 /*return*/, {
                            contract: contract,
                            options: options,
                        }];
            }
        });
    });
}
// Find one row in a table
function findOne(contractName, tableName, tableKey) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.eos.getTableRows({
                        code: contractName.toString(),
                        json: true,
                        limit: 1,
                        lower_bound: tableKey.toString(),
                        scope: contractName.toString(),
                        table: tableName.toString(),
                        upper_bound: tableKey.plus(1).toString(),
                    })];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.rows[0]];
            }
        });
    });
}
function getAllTableRows(params, key_field, json) {
    if (key_field === void 0) { key_field = 'id'; }
    if (json === void 0) { json = true; }
    return __awaiter(this, void 0, void 0, function () {
        var results, lowerBound, limit, parameters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    lowerBound = 0;
                    limit = -1;
                    parameters = __assign({}, params, { json: json, lower_bound: params.lower_bound || lowerBound, scope: params.scope || params.code, limit: params.limit || limit });
                    return [4 /*yield*/, this.eos.getTableRows(parameters)];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.rows];
            }
        });
    });
}
function getLatestBlock() {
    return __awaiter(this, void 0, void 0, function () {
        var info, block;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.eos.getInfo({})];
                case 1:
                    info = _a.sent();
                    return [4 /*yield*/, this.eos.getBlock(info.last_irreversible_block_num)];
                case 2:
                    block = _a.sent();
                    return [2 /*return*/, block];
            }
        });
    });
}
function getInstruments(params) {
    return __awaiter(this, void 0, void 0, function () {
        var keyType, index, results, lowerBound, upperBound, limit, parameters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    lowerBound = 0;
                    upperBound = -1;
                    limit = -1;
                    if (params.key_name === 'owner') {
                        keyType = 'i64';
                        index = 2;
                    }
                    else if (params.key_name === 'instrument_template') {
                        keyType = 'i64';
                        index = 3;
                    }
                    else if (params.key_name === 'instrument_class') {
                        keyType = 'i64';
                        index = 4;
                    }
                    else {
                        // index by instrument_id
                        keyType = 'i64';
                        index = 1;
                    }
                    parameters = __assign({}, params, { json: true, lower_bound: params.lower_bound || lowerBound, upper_bound: params.upper_bound || upperBound, scope: params.scope || params.code, limit: params.limit || limit, key_type: keyType || 'i64', index_position: index || 1 });
                    return [4 /*yield*/, this.eos.getTableRows(parameters)];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.rows];
            }
        });
    });
}
module.exports = {
    confirmTransaction: confirmTransaction,
    contract: contract,
    findOne: findOne,
    getAllTableRows: getAllTableRows,
    getLatestBlock: getLatestBlock,
    getInstruments: getInstruments,
    hasTransaction: hasTransaction,
    tableKey: tableKey,
};
//# sourceMappingURL=eos.js.map