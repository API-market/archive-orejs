const orejs = require("../index").orejs()

orejs.getInstruments('apiowner', 'apim.apiOffer').then(instruments => {
  console.log("getInstruments:", instruments)
})

orejs.findInstruments('apiuser', true, 'apim.apiVoucher', 'some_right_2').then(instruments => {
  console.log("findInstruments:", instruments)
})

/*
orejs.saveInstrument({}).then(instrument => {
  console.log("saveInstrument:", instrument)
})

orejs.exerciseInstrument('').then(instrument => {
  console.log("exerciseInstrument:", instrument)
})
*/
