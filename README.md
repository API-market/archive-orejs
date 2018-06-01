# OREJS Spec

orejs is helper library (written in Javascript) to provide simple high-level access to the ore-protocol. Orejs uses eosJS as a wrapper to the EOS blockchain.

### Constructor (EOSConfig)
* Constructs eosJs instance using EOSConfig

#### eosJs instance (exposed as a property on OreJS)

### createOreWallet (userWalletPassword)  => oreWalletName, encryptedWalletPassword)
create a new user account on the ORE network with wallet and associate it with a user’s identity
* Create EOS Wallet 
* * Generate userOreWalletName - using datetime pattern (yymmddhhmmssm) 
* * Generate wallet => new wallet password -> encrypt with userWalletPassword => encryptedWalletPassword
* * Create and import keypair (public and private)
* userOreAccountName same as userOreWalletName
* Create EOS Account
* * (userOreAccountName,  ore_eosio as creator account, owner:wallet public key, active:wallet public key)
* Return userOreWalletName

### getOreWallet (oreAccountName) - returns cpuBalance, [instruments]
* Calls getCpuBalance
* Calls getInstruments
* returns [walletName, [cpuBalance, [instrument]]

### getCpuBalance (oreAccountName, walletName (optional)) => cpu balance
* Calls CPU contract balanceOf(oreAccountName) and returns cpu balance

### getInstruments (oreAccountName, category (optional)) => [Instruments]
* Calls instrument byHolder(oreAccountName) 
* Filters instruments by category (if provided)

### findInstruments (oreAccountName, activeOnly, category (optional), right_name (optional)) => [Instruments]
* Where args is search criteria could include (category, rights_name)
Note: this requires an index on the rights collection (to filter right names)

### saveInstrument (Instrument) 
* Confirms that issuer in Instrument matches signature of transaction
* Creates an instrument token, populate with params, save to issuer account
* Saves endpoints to endpoints_published

### exerciseInstrument (offerInstrumentId) 
* Call the endpoint in the instrument, adding the options params (defined in the instrument), and passing in the considerations (required list of instruments)
* Save the resulting instruments with current user set as holder

### signString (string) => signedString

### unlockWallet (eosWalletPassword) 
* Call eosjs.unlockWallet???? - This should not be necessary on EOS

## Client Library Flow
* Client needs an access token to talk to hosted API
* Client has wallet info: from keyfile (oreAccountName, encryptedWalletPassword) app secret: userWalletPassword => eosWalletPassword
* Instantiates OreJS using eosConfig 
* Call orejs.findInstruments(oreAccountName, activeOnly:true, args:{category:’apiMarket.apiVoucher’, rightName:’xxxx’}) => [apiVouchers]
* Choose one voucher - rules to select between vouchers: use cheapest priced and then with the one that has the earliest endDate
* Call cpuContract.approve(oreAccountName, cpuAmount) to designate amount to allow payment in cpu for the api call (from priceInCPU in the apiVoucher’s right for the specific endpoint desired)
* Call Verifier contract eos.contract(‘verifier’).then(verifierContract =>      verifierContract.issueAccessToken(apiVoucherId)) =>  url, accessToken
* Makes request to url with accessToken marked ore-authorization in header and returns results
