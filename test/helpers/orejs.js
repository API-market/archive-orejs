/* global ORE_NETWORK_URI:true */
/* global ORE_OWNER_ACCOUNT_KEY:true */
/* global ORE_PAYER_ACCOUNT_NAME:true */

const {
  Orejs,
} = require('../../src');
const {
  mockInfo,
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

function mockTransaction() {
  const mockupTransaction = jest.fn();

  const transaction = jest.fn();

  mockupTransaction.mockReturnValue(transaction);
  const orejs = constructOrejs();
  orejs.eos.transaction = mockupTransaction;

  return transaction;
}

module.exports = {
  constructOrejs,
  mockContract,
  mockTransaction,
};
