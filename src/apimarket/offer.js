const APIM_CONTRACT_NAME = 'manager.apim';

async function createOfferInstrument(oreAccountName, offerData, confirm = false) {
  // Create an offer
  const options = {
    authorization: `${oreAccountName}@active`,
  };
  const contract = await this.eos.getContract(APIM_CONTRACT_NAME, options);

  if (confirm) {
    return this.awaitTransaction(() => contract.publishapi(oreAccountName, offerData.issuer, offerData.api_voucher_license_price_in_cpu,
      offerData.api_voucher_lifetime_in_seconds, offerData.api_voucher_start_date, offerData.api_voucher_end_date,
      offerData.api_voucher_valid_forever, offerData.api_voucher_mutability, offerData.api_voucher_security_type,
      offerData.right_params, offerData.api_voucher_parameter_rules,
      offerData.offer_mutability, offerData.offer_security_type, offerData.offer_template,
      offerData.offer_start_time, offerData.offer_end_time, offerData.offer_override_id, options));
  }

  contract.publishapi(oreAccountName, offerData.issuer, offerData.api_voucher_license_price_in_cpu,
    offerData.api_voucher_lifetime_in_seconds, offerData.api_voucher_start_date, offerData.api_voucher_end_date,
    offerData.api_voucher_valid_forever, offerData.api_voucher_mutability, offerData.api_voucher_security_type,
    offerData.right_params, offerData.api_voucher_parameter_rules,
    offerData.offer_mutability, offerData.offer_security_type, offerData.offer_template,
    offerData.offer_start_time, offerData.offer_end_time, offerData.offer_override_id, options);
  return this;
}

module.exports = {
  createOfferInstrument,
};
