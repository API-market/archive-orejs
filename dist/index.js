Eos = require('eosjs');
var cpu = require('./cpu');
var eos = require('./eos');
var instrument = require('./instrument');
var ore = require('./ore');
// THE ORE Network Chain ID
var CHAIN_ID = "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f";
var Orejs = /** @class */ (function () {
    function Orejs(config) {
        if (config === void 0) { config = {}; }
        config.chainId = config.chainId || CHAIN_ID;
        this.constructEos(config);
        /* Mixins */
        Object.assign(this, cpu);
        Object.assign(this, eos);
        Object.assign(this, instrument);
        Object.assign(this, ore);
    }
    Orejs.prototype.constructEos = function (config) {
        this.config = config;
        this.eos = Object.assign(Eos.modules, Eos.Localnet(this.config));
    };
    return Orejs;
}());
module.exports = {
    Orejs: Orejs
};
