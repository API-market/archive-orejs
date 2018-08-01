// Get info about the currently running eos instance
// Useful for finding the chain ID
//
// Usage: $ node eos/info

const orejs = require('../index').orejs();

(async function () {
  const info = await orejs.eos.getInfo({});
  console.log(info);
}());
