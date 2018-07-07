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
var BigNumber = require("bignumber.js");
var ecc = require('eosjs-ecc');
/* Private */
function filterRows(rows, filter) {
    if (!filter)
        return rows;
    var result = [];
    function fitsFilter(filter, row) {
        var fits = true;
        if (typeof filter === 'function') {
            fits = filter(row);
        }
        else if (typeof filter === 'object') {
            for (var f in filter) {
                if (filter[f] != row[f])
                    fits = false;
            }
        }
        else {
            throw "filter must be a function or an object";
        }
        return fits;
    }
    for (var r in rows) {
        var row = rows[r];
        var fits_filter = true;
        if (filter instanceof Array) {
            for (var f in filter) {
                if (!filter[f])
                    continue;
                fits_filter = fits_filter && fitsFilter(filter[f], row);
            }
        }
        else {
            fits_filter = fitsFilter(filter, row);
        }
        if (!fits_filter)
            continue;
        result.push(rows[r]);
    }
    return result;
}
function getTableRowsPage(params, lower_bound, page_size, json) {
    if (lower_bound === void 0) { lower_bound = 0; }
    if (page_size === void 0) { page_size = -1; }
    if (json === void 0) { json = true; }
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = __assign({}, params, { json: json, lower_bound: params.lower_bound || lower_bound, scope: params.scope || params.code, limit: page_size, upper_bound: params.upper_bound });
                    if (!params.upper_bound)
                        delete params.upper_bound;
                    return [4 /*yield*/, this.eos.getTableRows(params)];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
function keyProvider() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (this.config.keyProvider instanceof Array) {
                return [2 /*return*/, this.config.keyProvider[0]];
            }
            return [2 /*return*/, this.config.keyProvider];
        });
    });
}
/* Public */
function contract(contractName, accountName) {
    return __awaiter(this, void 0, void 0, function () {
        var options, contract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = { authorization: accountName + "@active" };
                    return [4 /*yield*/, this.eos.contract(contractName, options)];
                case 1:
                    contract = _a.sent();
                    return [2 /*return*/, { contract: contract, options: options }];
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
                        upper_bound: tableKey.plus(1).toString()
                    })];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.rows[0]];
            }
        });
    });
}
function getAllTableRows(params, key_field) {
    if (key_field === void 0) { key_field = "id"; }
    return __awaiter(this, void 0, void 0, function () {
        var more, results, lower_bound, result, last_key_value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    more = true;
                    results = [];
                    lower_bound = 0;
                    _a.label = 1;
                case 1: return [4 /*yield*/, getTableRowsPage.bind(this)(params, lower_bound)];
                case 2:
                    result = _a.sent();
                    more = result.more;
                    if (more) {
                        last_key_value = result.rows[result.rows.length - 1][key_field];
                        //if it's an account_name convert it to its numeric representation
                        if (isNaN(last_key_value)) {
                            last_key_value = tableKey(last_key_value);
                        }
                        lower_bound = (new BigNumber(last_key_value)).plus(1).toFixed();
                    }
                    results = results.concat(result.rows);
                    _a.label = 3;
                case 3:
                    if (more) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [2 /*return*/, results];
            }
        });
    });
}
function getAllTableRowsFiltered(params, filter, key_field) {
    if (key_field === void 0) { key_field = "id"; }
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllTableRows.bind(this)(params, key_field)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, filterRows(result, filter)];
            }
        });
    });
}
function signVoucher(apiVoucherId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ecc.sign(apiVoucherId.toString(), this.config.keyProvider[0])];
        });
    });
}
// Transform account names from base32 to their numeric representations
function tableKey(oreAccountName) {
    return new BigNumber(this.eos.format.encodeName(oreAccountName, false));
}
module.exports = {
    contract: contract,
    findOne: findOne,
    getAllTableRows: getAllTableRows,
    getAllTableRowsFiltered: getAllTableRowsFiltered,
    signVoucher: signVoucher,
    tableKey: tableKey
};
//# sourceMappingURL=eos.js.map