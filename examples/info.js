const {orejs} = require("./index")

orejs.eos.getInfo({}).then(info => console.log(info))
