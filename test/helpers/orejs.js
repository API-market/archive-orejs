const { Orejs } = require('../../src');
const { mockInfo } = require('./fetch');

function constructOrejs() {
  fetch.mockResponses(mockInfo());

  orejs = new Orejs({
    httpEndpoint: ORE_NETWORK_URI,
    keyProvider: [ORE_OWNER_ACCOUNT_KEY],
    orePayerAccountName: ORE_PAYER_ACCOUNT_NAME,
    sign: true,
  });

  return orejs;
}

function mockContract() {
  const mockContract = jest.fn();

  const contract = {
    approve: jest.fn(),
    transfer: jest.fn(),
  };

  mockContract.mockReturnValue(contract);
  orejs.eos.contract = mockContract;

  return contract;
}

function mockTransaction() {
  const mockTransaction = jest.fn();

  const transaction = jest.fn();

  mockTransaction.mockReturnValue(transaction);
  orejs.eos.transaction = mockTransaction;

  return transaction;
}

module.exports = {
  constructOrejs,
  mockContract,
  mockTransaction,
};
