const RIGHT_CONTRACT_NAME = "rights.ore"

async function setRightsInRegistry(oreAccountName, rightData) {
    // Enables the rights issuers add & modify rights, seperately from instruments
    let options = {authorization: `${oreAccountName}@active`}
    let contract = await this.eos.contract(RIGHT_CONTRACT_NAME, options)

    // upsertright(account_name issuer, string &right_name, vector<ore_types::endpoint_url> urls, vector<account_name> issuer_whitelist)
    const right = await contract.upsertright(oreAccountName, rightData.right_name, rightData.urls, rightData.issuer_whitelist, options)
    return right
  }

module.exports = {
    setRightsInRegistry
}