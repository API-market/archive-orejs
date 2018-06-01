# OREJS Spec

orejs is helper library (written in Javascript) to provide simple high-level access to the ore-protocol. Orejs uses eosJS as a wrapper to the EOS blockchain.

## Example
```
node example
```

## Client Library Flow
* Client needs an access token to talk to hosted API
* Client has wallet info: from keyfile (oreAccountName, encryptedWalletPassword) app secret: userWalletPassword => eosWalletPassword
* Instantiates OreJS using eosConfig
* Call orejs.findInstruments(oreAccountName, activeOnly:true, args:{category:’apiMarket.apiVoucher’, rightName:’xxxx’}) => [apiVouchers]
* Choose one voucher - rules to select between vouchers: use cheapest priced and then with the one that has the earliest endDate
* Call cpuContract.approve(oreAccountName, cpuAmount) to designate amount to allow payment in cpu for the api call (from priceInCPU in the apiVoucher’s right for the specific endpoint desired)
* Call Verifier contract eos.contract(‘verifier’).then(verifierContract =>      verifierContract.issueAccessToken(apiVoucherId)) =>  url, accessToken
* Makes request to url with accessToken marked ore-authorization in header and returns results
