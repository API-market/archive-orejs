const { Orejs } = require("../src")

const orejs = new Orejs()
console.log(orejs)
orejs.eos.getInfo({}).then(info => console.log(info))
