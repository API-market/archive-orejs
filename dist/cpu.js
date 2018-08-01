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
const CPU_CONTRACT_NAME = 'cpu.ore';
const TABLE_NAME = 'accounts';
/* Public */
function cpuContract(accountName) {
  return __awaiter(this, void 0, void 0, function () {
    let options,
      contract;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          options = { authorization: `${accountName}@active` };
          return [4 /* yield */, this.eos.contract(CPU_CONTRACT_NAME, options)];
        case 1:
          contract = _a.sent();
          return [2 /* return */, { contract, options }];
      }
    });
  });
}
function approveCpu(fromAccountName, toAccountName, cpuAmount) {
  return __awaiter(this, void 0, void 0, function () {
    let _a,
      contract,
      options;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0: return [4 /* yield */, cpuContract.bind(this)(fromAccountName)];
        case 1:
          _a = _b.sent(), contract = _a.contract, options = _a.options;
          return [4 /* yield */, contract.approvemore(fromAccountName, toAccountName, cpuAmount, options)];
        case 2:
          _b.sent();
          return [2];
      }
    });
  });
}
function getCpuBalance(oreAccountName) {
  return __awaiter(this, void 0, void 0, function () {
    let table_key,
      account;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          table_key = this.tableKey(oreAccountName);
          return [4 /* yield */, this.findOne(CPU_CONTRACT_NAME, TABLE_NAME, table_key)];
        case 1:
          account = _a.sent();
          if (account) {
            return [2 /* return */, account.balance];
          }
          return [2 /* return */, 0];
      }
    });
  });
}
function transferCpu(fromAccountName, toAccountName, amount) {
  return __awaiter(this, void 0, void 0, function () {
    let _a,
      contract,
      options;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0: return [4 /* yield */, cpuContract.bind(this)(fromAccountName)];
        case 1:
          _a = _b.sent(), contract = _a.contract, options = _a.options;
          return [4 /* yield */, contract.transfer(fromAccountName, toAccountName, amount, options)];
        case 2:
          _b.sent();
          return [2];
      }
    });
  });
}
module.exports = {
  approveCpu,
  cpuContract,
  getCpuBalance,
  transferCpu,
};
// # sourceMappingURL=cpu.js.map
