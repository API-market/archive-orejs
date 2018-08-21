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
var APIM_CONTRACT_NAME = 'manager.apim';
var INSTR_CONTRACT_NAME = 'instr.ore';
var INSTR_TABLE_NAME = 'tokensv2';
var ecc = require('eosjs-ecc');
/* Private */
function isActive(instrument) {
    var startTime = instrument.instrument.start_time;
    var endTime = instrument.instrument.end_time;
    var currentTime = Math.floor(Date.now() / 1000);
    return (currentTime > startTime && currentTime < endTime);
}
/* Public */
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
function getAllInstruments() {
    return __awaiter(this, void 0, void 0, function () {
        var instruments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getInstruments.bind(this)({
                        code: 'instr.ore',
                        table: 'tokensv2',
                    })];
                case 1:
                    instruments = _a.sent();
                    return [2 /*return*/, instruments];
            }
        });
    });
}
function getRight(instrument, rightName) {
    var _a = instrument.instrument, rights = (_a === void 0 ? {} : _a).rights;
    var right = rights.find(function (rightObject) {
        if (rightObject.right_name === rightName) {
            return rightObject;
        }
        return undefined;
    });
    return right;
}
function hasCategory(instrument, category) {
    if (instrument.instrument.instrument_class === category) {
        return true;
    }
    return false;
}
function findInstruments(oreAccountName, activeOnly, category, rightName) {
    if (activeOnly === void 0) { activeOnly = true; }
    if (category === void 0) { category = undefined; }
    if (rightName === void 0) { rightName = undefined; }
    return __awaiter(this, void 0, void 0, function () {
        var tableKey, instruments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tableKey = this.tableKey(oreAccountName);
                    return [4 /*yield*/, getInstruments.bind(this)({
                            code: 'instr.ore',
                            table: 'tokensv2',
                            lower_bound: tableKey.toString(),
                            upper_bound: tableKey.plus(1).toString(),
                            key_name: 'owner',
                        })];
                case 1:
                    instruments = _a.sent();
                    if (activeOnly) {
                        instruments = instruments.filter(function (element) { return isActive(element); });
                    }
                    if (category) {
                        instruments = instruments.filter(function (element) { return hasCategory(element, category); });
                    }
                    if (!rightName) return [3 /*break*/, 3];
                    return [4 /*yield*/, this.getInstrumentsByRight.bind(this)(instruments, rightName)];
                case 2:
                    instruments = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, instruments];
            }
        });
    });
}
function createOfferInstrument(oreAccountName, offerInstrumentData, confirm) {
    if (confirm === void 0) { confirm = false; }
    return __awaiter(this, void 0, void 0, function () {
        var options, contract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        authorization: oreAccountName + "@owner",
                    };
                    return [4 /*yield*/, this.eos.contract(APIM_CONTRACT_NAME, options)];
                case 1:
                    contract = _a.sent();
                    if (confirm) {
                        return [2 /*return*/, this.confirmTransaction(function () { return contract.publishapi(oreAccountName, offerInstrumentData.issuer, offerInstrumentData.api_name, offerInstrumentData.additional_api_params, offerInstrumentData.api_payment_model, offerInstrumentData.api_price_in_cpu, offerInstrumentData.license_price_in_cpu, offerInstrumentData.api_description, offerInstrumentData.right_registry, offerInstrumentData.instrument_template, offerInstrumentData.start_time, offerInstrumentData.end_time, offerInstrumentData.override_offer_id, options); })];
                    }
                    contract.publishapi(oreAccountName, offerInstrumentData.issuer, offerInstrumentData.api_name, offerInstrumentData.additional_api_params, offerInstrumentData.api_payment_model, offerInstrumentData.api_price_in_cpu, offerInstrumentData.license_price_in_cpu, offerInstrumentData.api_description, offerInstrumentData.right_registry, offerInstrumentData.instrument_template, offerInstrumentData.start_time, offerInstrumentData.end_time, offerInstrumentData.override_offer_id, options);
                    return [2 /*return*/, this];
            }
        });
    });
}
function createVoucherInstrument(creator, buyer, offerId, overrideVoucherId, offerTemplate, confirm) {
    if (overrideVoucherId === void 0) { overrideVoucherId = 0; }
    if (offerTemplate === void 0) { offerTemplate = ''; }
    if (confirm === void 0) { confirm = false; }
    return __awaiter(this, void 0, void 0, function () {
        var options, contract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Exercise an offer to get a voucher
                    // overrideVoucherId is passed in to specify the voucher id for the new voucher. If its value is 0, then the voucher id is auto generated
                    // either offerTemplate or offerId could be passed in to get a voucher for that offer.
                    if (offerId === 0 && offerTemplate === '') {
                        throw new Error('Either pass in a valid offer id or a valid offer template');
                    }
                    options = {
                        authorization: creator + "@owner",
                    };
                    return [4 /*yield*/, this.eos.contract(APIM_CONTRACT_NAME, options)];
                case 1:
                    contract = _a.sent();
                    if (confirm) {
                        return [2 /*return*/, this.confirmTransaction(function () { return contract.licenseapi(creator, buyer, offerId, offerTemplate, overrideVoucherId, options); })];
                    }
                    contract.licenseapi(creator, buyer, offerId, offerTemplate, overrideVoucherId, options);
                    return [2 /*return*/, this];
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
module.exports = {
    getRight: getRight,
    getAllInstruments: getAllInstruments,
    findInstruments: findInstruments,
    createOfferInstrument: createOfferInstrument,
    createVoucherInstrument: createVoucherInstrument,
    signVoucher: signVoucher,
};
//# sourceMappingURL=instrument.js.map