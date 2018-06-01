function createOreWallet(userWalletPassword) {
  // create a new user account on the ORE network with wallet and associate it with a user’s identity
  // Create EOS Wallet
  // Generate userOreWalletName - using datetime pattern (yymmddhhmmssm)
  // Generate wallet => new wallet password -> encrypt with userWalletPassword => encryptedWalletPassword
  // Create and import keypair (public and private)
  // userOreAccountName same as userOreWalletName
  // Create EOS Account
  // (userOreAccountName,  ore_eosio as creator account, owner:wallet public key, active:wallet public key)
  //return userOreWalletName
}

function getOreWallet(oreAccountName) {
  // Calls getCpuBalance
  // Calls getInstruments
  // returns [walletName, [cpuBalance, [instrument]]
}

function unlockWallet(eosWalletPassword) {
  // Call eosjs.unlockWallet???? - This should not be necessary on EOS
}

module.exports = {
  createOreWallet,
  getOreWallet,
  unlockWallet
}
