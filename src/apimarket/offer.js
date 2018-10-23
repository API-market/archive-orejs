const APIM_CONTRACT_NAME = 'manager.apim';

async function createOfferInstrument(oreAccountName, offerData, confirm = false) {
  // Create an offer
  const options = {
    authorization: `${oreAccountName}@active`,
  };
  const contract = await this.eos.contract(APIM_CONTRACT_NAME, options);
  if (confirm) {
    return this.awaitTransaction(() => contract.publishapi(oreAccountName, offerData.issuer, offerData.security_type,
      offerData.mutability, offerData.api_params, offerData.additional_url_params,
      offerData.parameter_rules, offerData.instrument_template, offerData.start_time,
      offerData.end_time, offerData.override_offer_id, options));
  }
  contract.publishapi(oreAccountName, offerData.issuer, offerData.security_type,
    offerData.mutability, offerData.api_params, offerData.additional_url_params,
    offerData.parameter_rules, offerData.instrument_template, offerData.start_time,
    offerData.end_time, offerData.override_offer_id, options);
  return this;
}

module.exports = {
  createOfferInstrument,
};
