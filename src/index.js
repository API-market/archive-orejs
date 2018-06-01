const cpu = require('./cpu')
const instrument = require('./instrument')
const ore = require('./ore')

class Orejs {
  constructor(config) {
    Object.assign(this, config)

    /* Mixins */
    Object.assign(this, cpu)
    Object.assign(this, instrument)
    Object.assign(this, ore)
  }
}

module.exports = {
  Orejs
}
