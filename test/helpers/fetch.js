function expectFetch(...urls) {
  expect(fetch.mock.calls.length).toEqual(urls.length);
  urls.forEach((url, i) => {
    expect(fetch.mock.calls[i][0]).toEqual(url);
  });
}

function mock(body, status = 200) {
  return [
    JSON.stringify([
      body,
    ]),
    {
      status
    },
  ];
}

function mockBlock() {
  return mock({
    timestamp: '2018-07-30T14:24:24.000',
    producer: 'eosio',
    confirmed: 0,
    previous: '00090a02e194bf83b406638a2165c69abdb6524aab0e0d9323e5788871501af9',
    transaction_mroot: '0000000000000000000000000000000000000000000000000000000000000000',
    action_mroot: 'b6ad4c65a79b1b43d223cfcbe3445b40e6fbd308a769fd8db9eed7404ecf2df7',
    schedule_version: 0,
    new_producers: null,
    header_extensions: [],
    producer_signature: 'SIG_K1_KbGoYqtV83Y7FeJ72sNNvmW7o3AMEMVug9HFPDovYTS6gZGERMdUs8neva44nMHB7qnUeSGn8A6PcuvZ9GR6mStChzMSD5',
    transactions: [],
    block_extensions: [],
    id: '00090a0384aa271b99b94d25a3d069c4387625e972d05c21ffa17180d1f09ec2',
    block_num: 592387,
    ref_block_prefix: 625850777,
  });
}

function mockInfo() {
  return mock({
    server_version: '75635168',
    chain_id: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    head_block_num: 591911,
    last_irreversible_block_num: 591910,
    last_irreversible_block_id: '00090826ea7ed488caa5bf6b1e3ce25b5bd34f388249cc6893b473bc01c3416f',
    head_block_id: '00090827d92a0b18d95562ddb45bc213a09a2ab0d1a408e7d00e62e0cc70e69c',
    head_block_time: '2018-07-30T14:20:26.000',
    head_block_producer: 'eosio',
    virtual_block_cpu_limit: 200000000,
    virtual_block_net_limit: 1048576000,
    block_cpu_limit: 199900,
    block_net_limit: 1048576,
  });
}

module.exports = {
  expectFetch,
  mock,
  mockBlock,
  mockInfo,
};