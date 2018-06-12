Eos = require('eosjs')
const cpu = require('./cpu')
const eos = require('./eos')
const instrument = require('./instrument')
const ore = require('./ore')

class Orejs {
  constructor(config = {}) {
    this.constructEos(config)

    /* Mixins */
    Object.assign(this, cpu)
    Object.assign(this, eos)
    Object.assign(this, instrument)
    Object.assign(this, ore)
  }

  constructEos(config) {
    this.config = config
    this.eos = Object.assign(Eos.modules, Eos.Localnet(this.config))
  }
}

module.exports = {
  Orejs
}
