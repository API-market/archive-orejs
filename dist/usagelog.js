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
var INSTR_CONTRACT_NAME = 'instr.ore';
var INSTR_USAGE_CONTRACT_NAME = 'usagelog.ore';
var INSTR_TABLE_NAME = 'tokensv2';
var LOG_COUNT_TABLE_NAME = 'counts';
/* Private */
function getInstrumentsByRight(instrumentList, rightName) {
    return __awaiter(this, void 0, void 0, function () {
        var instruments;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, instrumentList.filter(function (instrument) { return _this.getRight(instrument, rightName) !== undefined; })];
                case 1:
                    instruments = _a.sent();
                    return [2 /*return*/, instruments];
            }
        });
    });
}
function getInstrumentByOwner(owner) {
    return __awaiter(this, void 0, void 0, function () {
        var instruments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findInstruments(owner)];
                case 1:
                    instruments = _a.sent();
                    return [2 /*return*/, instruments];
            }
        });
    });
}
/* Public */
function getApiCallStats(instrumentId, rightName) {
    return __awaiter(this, void 0, void 0, function () {
        var result, rightProperties, rightObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.eos.getTableRows({
                        code: INSTR_USAGE_CONTRACT_NAME,
                        json: true,
                        scope: instrumentId,
                        table: LOG_COUNT_TABLE_NAME,
                        limit: -1,
                    })];
                case 1:
                    result = _a.sent();
                    rightProperties = {
                        totalApiCalls: 0,
                        totalCpuUsage: 0,
                    };
                    return [4 /*yield*/, result.rows.find(function (right) { return right.right_name === rightName; })];
                case 2:
                    rightObject = _a.sent();
                    if (rightObject !== undefined) {
                        rightProperties.totalApiCalls = rightObject.total_count;
                        rightProperties.totalCpuUsage = rightObject.total_cpu;
                    }
                    return [2 /*return*/, rightProperties];
            }
        });
    });
}
function getRightStats(rightName, owner) {
    return __awaiter(this, void 0, void 0, function () {
        var instruments, rightProperties, results, value;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!owner) return [3 /*break*/, 2];
                    return [4 /*yield*/, getInstrumentByOwner.bind(this)(owner)];
                case 1:
                    instruments = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, this.getAllTableRows({
                        code: INSTR_CONTRACT_NAME,
                        scope: INSTR_CONTRACT_NAME,
                        table: INSTR_TABLE_NAME,
                        limit: -1,
                    })];
                case 3:
                    instruments = _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, getInstrumentsByRight.bind(this)(instruments, rightName)];
                case 5:
                    instruments = _a.sent();
                    results = instruments.map(function (instrumentObject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getApiCallStats.bind(this)(instrumentObject.id, rightName)];
                                case 1:
                                    rightProperties = _a.sent();
                                    return [2 /*return*/, rightProperties];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(results)];
                case 6:
                    value = _a.sent();
                    return [2 /*return*/, {
                            totalCpuUsage: value.reduce(function (a, b) { return a + parseFloat(b.totalCpuUsage); }, 0),
                            totalApiCalls: value.reduce(function (a, b) { return a + parseFloat(b.totalApiCalls); }, 0),
                        }];
            }
        });
    });
}
module.exports = {
    getApiCallStats: getApiCallStats,
    getRightStats: getRightStats,
    getInstrumentsByRight: getInstrumentsByRight,
};
//# sourceMappingURL=usagelog.js.map