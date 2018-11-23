global.fetch = require('jest-fetch-mock');

// The following account keys are not used in production...

global.ORE_NETWORK_URI = 'http://127.0.0.1:8888';
global.ORE_OWNER_ACCOUNT_NAME = 'app.apim';
global.ORE_OWNER_ACCOUNT_KEY = '5...';
global.ORE_PAYER_ACCOUNT_NAME = 'eosio';
global.ORE_PAYER_ACCOUNT_KEY = '5...';
global.ORE_TESTA_ACCOUNT_NAME = 'test1.apim';
global.ORE_TESTA_ACCOUNT_KEY = '5...';
global.ORE_TESTB_ACCOUNT_NAME = 'test2.apim';
global.ORE_TESTB_ACCOUNT_KEY = '5...';
global.WALLET_PASSWORD = '...';
global.USER_ACCOUNT_ENCRYPTION_SALT = '...';
