const orejs = require('../index').orejs();

orejs.getInstruments('apiowner', 'apiOffer.apim').then((instruments) => {
  console.log('getInstruments:', instruments);
});

orejs.findInstruments('apiuser', true, 'apiVoucher.apim', 'some_right_2').then((instruments) => {
  console.log('findInstruments:', instruments);
});
