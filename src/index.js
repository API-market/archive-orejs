Eos = require('eosjs')
const cpu = require('./cpu')
const eos = require('./eos')
const instrument = require('./instrument')
const ore = require('./ore')

// THE ORE Network Chain ID
const CHAIN_ID = "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"

class Orejs {
  constructor(config = {}) {
    config.chainId = config.chainId || CHAIN_ID

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
  ore,
  Orejs
}
