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
var CONTRACT_NAME = 'ore.instrument';
var TABLE_NAME = 'instruments';
/* Mocks */
var voucher = {
    category: "apimarket.apiVoucher",
    class: "apiVoucher.io.hadron.spacetelescope.201801021211212",
    description: "Human-readable description (Hadron Spacetelescope Access - High Availability US West Datacenter)",
    type: "pass",
    options: {},
    consideration: undefined,
    benefit: undefined,
    issuer: "uztcnztga3di",
    startDate: undefined,
    endDate: undefined,
    rights: {
        apiName: "io.hadron.spaceTelescope",
        options: {
            sla: "highAvailability",
            region: "usWest"
        },
        priceInCPU: 0.1,
        description: "Identify objects in image of deep space"
    }
};
var offer = {
    category: "apimarket.offer.licenseApi",
    class: "apiVoucher.io.hadron.spacetelescope.201801021211212",
    description: "Human-readable description (copied to the APIVouchers it creates)",
    type: "pass",
    options: {
        apiName: "io.hadron.spaceTelescope",
        sla: "default",
        paymentModel: "payPerCall"
    },
    consideration: undefined,
    benefit: undefined,
    issuer: "uztcnztga3di",
    startDate: undefined,
    endDate: undefined,
    rights: {
        endpoint: "ore.contract.createApiVoucher",
        options: {
            action: "create"
        },
        priceInCPU: 0.1,
        description: "Create API Voucher"
    }
};
/* Private */
function getAllInstruments(oreAccountName) {
    return __awaiter(this, void 0, void 0, function () {
        var table_key;
        return __generator(this, function (_a) {
            table_key = this.tableKey(oreAccountName);
            // TODO Connect this to the instrument contract
            //const rows = await this.findOne(CONTRACT_NAME, TABLE_NAME, table_key)
            return [2 /*return*/, [offer, voucher]];
        });
    });
}
/* Public */
function getInstruments(oreAccountName, category) {
    if (category === void 0) { category = undefined; }
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllInstruments.bind(this)(oreAccountName)];
                case 1:
                    rows = _a.sent();
                    if (category) {
                        return [2 /*return*/, rows.filter(function (row) {
                                return row.category.indexOf(category) >= 0;
                            })];
                    }
                    return [2 /*return*/, rows];
            }
        });
    });
}
function findInstruments(oreAccountName, activeOnly, category, rightName) {
    if (activeOnly === void 0) { activeOnly = true; }
    if (category === void 0) { category = undefined; }
    if (rightName === void 0) { rightName = undefined; }
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getInstruments.bind(this)(oreAccountName, category)
                    // TODO filter by activeOnly
                    // TODO filter by rightName
                ];
                case 1:
                    rows = _a.sent();
                    // TODO filter by activeOnly
                    // TODO filter by rightName
                    return [2 /*return*/, rows];
            }
        });
    });
}
function saveInstrument(instrument) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Confirms that issuer in Instrument matches signature of transaction
            // Creates an instrument token, populate with params, save to issuer account
            // Saves endpoints to endpoints_published
            return [2 /*return*/, instrument];
        });
    });
}
function exerciseInstrument(offerInstrumentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Call the endpoint in the instrument, adding the options params (defined in the instrument), and passing in the considerations (required list of instruments)
            // Save the resulting instruments with current user set as holder
            return [2 /*return*/, voucher];
        });
    });
}
module.exports = {
    exerciseInstrument: exerciseInstrument,
    findInstruments: findInstruments,
    getInstruments: getInstruments,
    saveInstrument: saveInstrument
};
