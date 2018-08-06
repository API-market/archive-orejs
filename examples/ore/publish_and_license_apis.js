// Mints token for all contracts listed in the keys.json file

// Usage: $ node ore/mint_tokens

const fs = require('fs');
const ecc = require('eosjs-ecc');
let orejs = require('../index').orejs();

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

async function connectAs(accountName, accountKey) {
  // Reinitialize the orejs library, with permissions for the current account...
  orejs = require('../index').orejs(accountName, accountKey);
}

(async function () {
  // Grab the current chain id...
  const info = await orejs.eos.getInfo({});
  console.log('Connecting to chain:', info.chain_id, '...');
  process.env.CHAIN_ID = info.chain_id;

  // cleos push action manager.apim publishapi `[ "apiowner", "goodapi", ${OFFERS}]` -p apiowner@active
  let contractName = 'manager.apim';

  // Example rights to insert
  const rights = {
    right_name: 'hadron-food-api',
    urls: [
      {
        url: 'www.hadron.com',
        method: 'post',
        matches_params: [
          {
            name: 'sla',
            value: 'high-availability',
          },
        ],
        token_life_span: 100,
        is_default: 1,
      },
    ],
    issuer_whitelist: [
      'app.apim',
    ],
  };

  // overrideOfferId is passed in to specify the offer id for the new offer. If its value is 0, then the offer id is auto generated
  const overrideOfferId = process.env.OVERRIDE_OFFER_ID || 0;

  // Example instrument to be created
  const instrument = {
    creator: 'app.apim',
    issuer: 'test1.apim',
    api_name: 'hadron-food-api',
    additional_api_params: [
      {
        name: 'sla',
        value: 'high-availability',
      },
    ],
    api_payment_model: 'paypercall',
    api_price_in_cpu: 1,
    license_price_in_cpu: 0,
    api_description: 'returns an image feature vector for input image',
    right_registry: {
      right_name: 'apimarket.manager.licenseApi',
      urls: [
        {
          url: 'ore://manager.apim/action/licenseapi',
          method: 'post',
          matches_params: [
            {
              name: 'sla',
              value: 'default',
            },
          ],
          token_life_span: 100,
          is_default: 1,
        },
      ],
      whitelist: [
        'app.apim',
      ],
    },
    start_time: 0,
    end_time: 0,
    override_offer_id: overrideOfferId,
  };

  // Initialise the orejs library as test user
  const accountName = process.env.ORE_TESTA_ACCOUNT_NAME;
  await connectAs(accountName, process.env.ORE_TESTA_ACCOUNT_KEY);

  // Add right to rights registry
  await orejs.setRightsInRegistry(accountName, rights);

  // Initialise the orejs library as app.apim
  await connectAs(process.env.ORE_OWNER_ACCOUNT_NAME, process.env.ORE_OWNER_ACCOUNT_KEY);

  // Create offer
  await orejs.createOfferInstrument(process.env.ORE_OWNER_ACCOUNT_NAME, instrument);

  // example buyer account and offer id
  const buyer = 'test2.apim';
  const offerId = 0;
  const overrideVoucherId = process.env.OVERRIDE_VOUCHER_ID;
  // Create voucher
  await orejs.createVoucherInstrument(process.env.ORE_OWNER_ACCOUNT_NAME, buyer, offerId, overrideVoucherId);

  // cleos get table instr.ore instr.ore tokens
  contractName = 'instr.ore';
  const instruments = await orejs.getAllTableRows({
    code: contractName,
    table: 'tokens',
  });

  console.log('Instruments:', instruments);
}());
