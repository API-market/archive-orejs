function mock(body, status = 200) {
  return [
    JSON.stringify([
      body
    ]),
    { status: status }
  ]
}

function mockInfo() {
  console.log("mockInfo", mock)
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
    block_net_limit: 1048576
  })
}

module.exports = {
  mockInfo
}
