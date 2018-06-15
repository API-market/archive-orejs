const {orejs} = require("./index")

orejs.getInstruments('orejs', 'apimarket.offer').then(instruments => {
  console.log("getInstruments:", instruments)
})

orejs.findInstruments('orejs', true, 'apimarket.offer').then(instruments => {
  console.log("findInstruments:", instruments)
})

orejs.saveInstrument({}).then(instrument => {
  console.log("saveInstrument:", instrument)
})

orejs.exerciseInstrument('').then(instrument => {
  console.log("exerciseInstrument:", instrument)
})
