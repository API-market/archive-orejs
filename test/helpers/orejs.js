/* global ORE_NETWORK_URI:true */
/* global ORE_OWNER_ACCOUNT_KEY:true */
/* global ORE_PAYER_ACCOUNT_NAME:true */

const {
  Orejs,
} = require('../../src');
const {
  mockAccount,
  mockBlock,
  mockInfo,
  mockTransaction,
} = require('./fetch');

function constructOrejs() {
  fetch.mockResponses(mockInfo());

  const orejs = new Orejs({
    httpEndpoint: ORE_NETWORK_URI,
    keyProvider: [ORE_OWNER_ACCOUNT_KEY],
    orePayerAccountName: ORE_PAYER_ACCOUNT_NAME,
    sign: true,
  });

  return orejs;
}

function mockContract() {
  const mockupContract = jest.fn();

  const contract = {
    approve: jest.fn(),
    licenseapi: jest.fn(),
    transfer: jest.fn(),
  };

  mockupContract.mockReturnValue(contract);
  const orejs = constructOrejs();
  orejs.eos.contract = mockupContract;

  return contract;
}

function mockGetAccount(_orejs = undefined, _account = {}) {
  const mockupAccount = jest.fn();

  const getAccount = JSON.parse(mockAccount(_account)[0])[0];

  mockupAccount.mockReturnValue(getAccount);
  const orejs = _orejs || constructOrejs();
  orejs.eos.getAccount = mockupAccount;

  return getAccount;
}

function mockGetBlock(_orejs = undefined, _block = {}) {
  const mockupBlock = jest.fn();

  const getBlock = JSON.parse(mockBlock(_block)[0])[0];

  mockupBlock.mockReturnValue(getBlock);
  const orejs = _orejs || constructOrejs();
  orejs.eos.getBlock = mockupBlock;

  return getBlock;
}

function mockGetInfo(_orejs = undefined, _info = {}) {
  const mockupInfo = jest.fn();

  const getInfo = JSON.parse(mockInfo(_info)[0])[0];

  mockupInfo.mockReturnValue(getInfo);
  const orejs = _orejs || constructOrejs();
  orejs.eos.getInfo = mockupInfo;

  return getInfo;
}

function mockGetTransaction(_orejs = undefined, _transaction = {}) {
  const mockupTransaction = jest.fn();

  const transaction = mockTransaction(_transaction);

  mockupTransaction.mockReturnValue(transaction);
  const orejs = _orejs || constructOrejs();
  orejs.eos.transaction = mockupTransaction;

  return transaction;
}

module.exports = {
  constructOrejs,
  mockContract,
  mockGetAccount,
  mockGetBlock,
  mockGetInfo,
  mockGetTransaction,
};
