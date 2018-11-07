/* global ORE_NETWORK_URI:true */
/* global ORE_OWNER_ACCOUNT_KEY:true */
/* global ORE_PAYER_ACCOUNT_NAME:true */

const {
  Orejs,
} = require('../../src');
const {
  mockAccount,
  mockAbi,
  mockBlock,
  mockCode,
  mockError,
  mockInfo,
  mockTransaction,
} = require('./fetch');

function constructOrejs(config) {
  const orejs = new Orejs({
    httpEndpoint: ORE_NETWORK_URI,
    keyProvider: [ORE_OWNER_ACCOUNT_KEY],
    orePayerAccountName: ORE_PAYER_ACCOUNT_NAME,
    sign: true,
    ...config,
  });

  return orejs;
}

function mockGetAbi(_orejs = undefined) {
  const mockupAbi = jest.fn();

  const getAbi = { code: mockCode(), abi: JSON.parse(mockAbi()) };

  mockupAbi.mockReturnValue(getAbi);
  const orejs = _orejs || constructOrejs();
  orejs.eos.rpc.get_raw_code_and_abi = mockupAbi;

  return getAbi;
}

function mockGetAccount(_orejs = undefined, _account = {}) {
  const mockupAccount = jest.fn();

  const getAccount = JSON.parse(mockAccount(_account)[0])[0];

  mockupAccount.mockReturnValue(getAccount);
  const orejs = _orejs || constructOrejs();
  orejs.eos.rpc.get_account = mockupAccount;

  return getAccount;
}

function mockGetBlock(_orejs = undefined, _block = {}) {
  const mockupBlock = jest.fn();

  const getBlock = JSON.parse(mockBlock(_block)[0])[0];

  mockupBlock.mockReturnValue(getBlock);
  const orejs = _orejs || constructOrejs();
  orejs.eos.rpc.get_block = mockupBlock;

  return getBlock;
}

function mockGetBlockError(_orejs = undefined) {
  const mockupBlock = jest.fn();

  const getBlock = mockError();

  mockupBlock.mockImplementation(() => {
    throw getBlock;
  });
  const orejs = _orejs || constructOrejs();
  orejs.eos.rpc.get_block = mockupBlock;

  return getBlock;
}

function mockGetCurrency(_orejs = undefined, _currency = '1.0000 CPU') {
  const mockupCurrency = jest.fn();

  const getCurrency = _currency;

  mockupCurrency.mockReturnValue(getCurrency);
  const orejs = _orejs || constructOrejs();
  orejs.eos.rpc.get_currency_balance = mockupCurrency;

  return getCurrency;
}

function mockGetInfo(_orejs = undefined, _info = {}) {
  const mockupInfo = jest.fn();

  const getInfo = JSON.parse(mockInfo(_info)[0])[0];

  mockupInfo.mockReturnValue(getInfo);
  const orejs = _orejs || constructOrejs();
  orejs.eos.rpc.get_info = mockupInfo;

  return getInfo;
}

function mockGetTransaction(_orejs = undefined, _transaction = {}) {
  const mockupTransaction = jest.fn();

  const getTransaction = mockTransaction(_transaction);

  mockupTransaction.mockReturnValue(getTransaction);
  const orejs = _orejs || constructOrejs();
  orejs.eos.transact = mockupTransaction;

  return getTransaction;
}

module.exports = {
  constructOrejs,
  mockGetAbi,
  mockGetAccount,
  mockGetBlock,
  mockGetBlockError,
  mockGetCurrency,
  mockGetInfo,
  mockGetTransaction,
};
