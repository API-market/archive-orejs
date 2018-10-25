const Eos = require('eosjs');
const accounts = require('./accounts');
const cpu = require('./tokens/cpu');
const crypto = require('./modules/crypto');
const eos = require('./eos');
const instrument = require('./instrument');
const offer = require('./apimarket/offer');
const ore = require('./tokens/ore');
const oreStandardToken = require('./orestandardtoken');
const rightsRegistry = require('./rightsregistry');
const voucher = require('./apimarket/voucher');
const usageLog = require('./usagelog');

class Orejs {
  constructor(config = {}) {
    this.constructEos(config);

    /* Mixins */
    Object.assign(this, accounts);
    Object.assign(this, cpu);
    Object.assign(this, crypto);
    Object.assign(this, eos);
    Object.assign(this, instrument);
    Object.assign(this, offer);
    Object.assign(this, ore);
    Object.assign(this, oreStandardToken);
    Object.assign(this, rightsRegistry);
    Object.assign(this, usageLog);
    Object.assign(this, voucher);
  }

  constructEos(config) {
    this.config = config;
    this.eos = Object.assign(Eos.modules, Eos(this.config));
  }
}

module.exports = {
  crypto,
  Orejs,
};
