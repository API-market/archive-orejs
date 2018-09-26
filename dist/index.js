var Eos = require('eosjs');
var accounts = require('./accounts');
var cpu = require('./tokens/cpu');
var eos = require('./eos');
var instrument = require('./instrument');
var crypto = require('./modules/crypto');
var ore = require('./tokens/ore');
var oreStandardToken = require('./orestandardtoken');
var rightsRegistry = require('./rightsregistry');
var usageLog = require('./usagelog');
var Orejs = /** @class */ (function () {
    function Orejs(config) {
        if (config === void 0) { config = {}; }
        this.constructEos(config);
        /* Mixins */
        Object.assign(this, accounts);
        Object.assign(this, cpu);
        Object.assign(this, crypto);
        Object.assign(this, eos);
        Object.assign(this, instrument);
        Object.assign(this, ore);
        Object.assign(this, oreStandardToken);
        Object.assign(this, rightsRegistry);
        Object.assign(this, usageLog);
    }
    Orejs.prototype.constructEos = function (config) {
        this.config = config;
        this.eos = Object.assign(Eos.modules, Eos(this.config));
    };
    return Orejs;
}());
module.exports = {
    crypto: crypto,
    Orejs: Orejs,
};
//# sourceMappingURL=index.js.map