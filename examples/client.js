const {orejs, walletPassword} = require("./index")

const OFFER = {category: 'apiMarket.apiVoucher', rightName: 'xxxx'}
const VOUCHER = {url: 'https://github.com'}
let oreAccount;

orejs.createOreWallet(walletPassword).then(wallet => {
  console.log("Wallet Created:", wallet)

  // Get the newly created EOS wallet...
  return orejs.getOreAccount(wallet.oreAccountName)
}).then(account => {
  console.log("Account:", account)

  oreAccount = account;
  // Create a new offer...
  return orejs.saveInstrument(OFFER)
}).then(offer => {
  console.log("Offer:", offer)

  // Create a new voucher...
  return orejs.saveInstrument(VOUCHER)
}).then(voucher => {
  console.log("Voucher:", voucher)

  // Find the active vouchers...
  return orejs.findInstruments(oreAccount.account_name, true, OFFER.category, OFFER.rightName)
}).then(vouchers => {
  console.log("Vouchers:", vouchers)

  // Choose a voucher...
  // use cheapest priced and then with the one that has the earliest endDate
  return {}
}).then(voucher => {
  console.log("Voucher:", voucher)

  // Exercise/Approve the voucher with the verifier
  // to designate amount to allow payment in cpu for the api call (from priceInCPU in the apiVoucher’s right for the specific endpoint desired)
  return orejs.exerciseInstrument(VOUCHER.id)
}).then(voucher => {
  console.log("Voucher:", voucher)

  // Verifier responds with an access token
  /*
  return verifierContract.issueAccessToken(voucher.id)
}).then(accessToken => {
  console.log("accessToken:", accessToken)
  */
  let accessToken = undefined

  // Request to url, with accessToken...
  fetch(VOUCHER.url, {
    method: 'POST',
    //body:    JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Token': accessToken
    }
  }).then(res => {
    res.text()
  }).then(body => {
    console.log("Response:", body)
  })
})
