const { expectFetch, mock, mockInfo } = require("./helpers/fetch")
const { constructOrejs } = require("./helpers/orejs")

describe("cpu", () => {
  let orejs

  beforeAll(() => {
    orejs = constructOrejs()
  })

  describe("getCpuBalance", () => {
    let cpuBalance

    beforeEach(() => {
      cpuBalance = 30

      fetch.resetMocks()
      fetch.mockResponses(mock(`${cpuBalance}.0000 CPU`))
    })

    test("returns the cpu balance", async () => {
      const cpuBalance = await orejs.getCpuBalance(ORE_TESTA_ACCOUNT_NAME)
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_currency_balance`)
      expect(cpuBalance).toEqual(cpuBalance)
    })
  })

  describe("approveCpu", () => {
    let cpuBalance

    beforeEach(() => {
      cpuBalance = 10

      /*
      fetch.resetMocks()
      fetch.mockResponses(mock({
        account_name: 'token.ore',
        abi: {
          version: 'eosio::abi/1.0',
          types: [ [Object] ],
          structs:
            [ [Object],
              [Object],
              [Object],
              [Object],
              [Object],
              [Object],
              [Object],
              [Object],
              [Object],
              [Object],
              [Object] ],
          actions:
            [ [Object],
              [Object],
              [Object],
              [Object],
              [Object],
              [Object],
              [Object] ],
          tables: [ [Object], [Object], [Object] ],
          ricardian_clauses: [],
          error_messages: [],
          abi_extensions: []
        }
      }), mockInfo())
      */

      /*
      {"account_name":"token.ore","abi":{"version":"eosio::abi/1.0","types":[{"new_type_name":"symbol_name","type":"uint64"}],"structs":[{"name":"account","base":"","fields":[{"name":"balance","type":"asset"}]},{"name":"currencystat","base":"","fields":[{"name":"supply","type":"asset"},{"name":"max_supply","type":"asset"},{"name":"issuer","type":"name"}]},{"name":"allowance","base":"","fields":[{"name":"to","type":"name"},{"name":"quantity","type":"asset"}]},{"name":"create","base":"","fields":[{"name":"issuer","type":"name"},{"name":"maximum_supply","type":"asset"}]},{"name":"issue","base":"","fields":[{"name":"to","type":"name"},{"name":"quantity","type":"asset"},{"name":"memo","type":"string"}]},{"name":"retire","base":"","fields":[{"name":"quantity","type":"asset"},{"name":"memo","type":"string"}]},{"name":"transfer","base":"","fields":[{"name":"from","type":"name"},{"name":"to","type":"name"},{"name":"quantity","type":"asset"},{"name":"memo","type":"string"}]},{"name":"approve","base":"","fields":[{"name":"from","type":"name"},{"name":"to","type":"name"},{"name":"quantity","type":"asset"}]},{"name":"transferfrom","base":"","fields":[{"name":"sender","type":"name"},{"name":"from","type":"name"},{"name":"to","type":"name"},{"name":"quantity","type":"asset"}]},{"name":"symbol_type","base":"","fields":[{"name":"value","type":"symbol_name"}]},{"name":"close","base":"","fields":[{"name":"owner","type":"name"},{"name":"symbol","type":"symbol_type"}]}],"actions":[{"name":"create","type":"create","ricardian_contract":""},{"name":"issue","type":"issue","ricardian_contract":""},{"name":"retire","type":"retire","ricardian_contract":""},{"name":"transfer","type":"transfer","ricardian_contract":""},{"name":"approve","type":"approve","ricardian_contract":""},{"name":"transferfrom","type":"transferfrom","ricardian_contract":""},{"name":"close","type":"close","ricardian_contract":""}],"tables":[{"name":"accounts","index_type":"i64","key_names":["balance"],"key_types":["asset"],"type":"account"},{"name":"stat","index_type":"i64","key_names":["supply"],"key_types":["asset"],"type":"currencystat"},{"name":"allowances","index_type":"i64","key_names":["to"],"key_types":["name"],"type":"allowance"}],"ricardian_clauses":[],"error_messages":[],"abi_extensions":[]}}
      */
    })

    describe("when authorized", () => {
      describe("when has enough CPU", () => {
        test("returns", async () => {
          // TODO Figure out how to deal with multiple http requests through eosjs
          // NOTE Until then, let's mock the calls to eosjs...
          /*
          let mockApprove = jest.fn()
          mockApprove.mockReturnValue({

          })
          let mockContract = jest.fn()
          mockContract.mockReturnValue({
            approve: mockApprove
          })
          orejs.eos.contract = mockContract
          //let spy = jest.spyOn(orejs.eos, 'contract')
          /*
      token.ore [ 'transaction',
        'create',
        'issue',
        'retire',
        'transfer',
        'approve',
        'transferfrom',
        'close',
        'fc' ] { authorization: 'app.apim@active' }
        */
          const result = await orejs.approveCpu(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, cpuBalance)
          //expect(spy).toHaveBeenCalled()
          expect(result).toEqual(undefined)
        })
      })

      describe("when does not have enough CPU", () => {
        test("returns", () => {
        })
      })
    })

    describe("when unauthorized", () => {
      test("returns", () => {
      })
    })
  })

  // function transferCpu(fromAccountName, toAccountName, cpuAmount, memo="") {
})
