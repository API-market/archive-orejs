const {orejs, walletPassword} = require("./index")

const balance = orejs.getCpuBalance('token.eos2').then(balance => {
  console.log("Balance:", balance)
})
