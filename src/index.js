Eos = require('eosjs')
const accounts = require('./accounts')
const eos = require('./eos')
const instrument = require('./instrument')
const token = require('./token')
const cpu = require('./tokens/cpu')
const ore = require('./tokens/ore')
const rightRegistry = require('./rightsregistry')

class Orejs {
  constructor(config = {}) {
<<<<<<< HEAD
=======
    config.chainId = config.chainId
>>>>>>> 07d84e8f9fa85f5cfb7560568259f5a7fa84e8c9

    this.constructEos(config)

    /* Mixins */
    Object.assign(this, accounts)
    Object.assign(this, cpu)
    Object.assign(this, eos)
    Object.assign(this, instrument)
    Object.assign(this, ore)
    Object.assign(this, rightRegistry)
    Object.assign(this, token)
  }

  constructEos(config) {
    this.config = config
    this.eos = Object.assign(Eos.modules, Eos(this.config))
  }
}

module.exports = {
  Orejs
}
