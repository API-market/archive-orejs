const { Orejs } = require("../src")
const { expectFetch, mock, mockInfo } = require("./helpers/fetch")

describe("cpu", () => {
  let orejs, oreAccountName

  beforeAll(() => {
    oreAccountName = ORE_TESTA_ACCOUNT_NAME

    fetch.mockResponses(mockInfo())

    orejs = new Orejs({
      httpEndpoint: ORE_NETWORK_URI,
      keyProvider: [ORE_OWNER_ACCOUNT_KEY],
      orePayerAccountName: ORE_PAYER_ACCOUNT_NAME,
      sign: true
    })
  })

  describe("getCpuBalance", () => {
    let cpuBalance

    beforeEach(() => {
      cpuBalance = 30

      fetch.resetMocks()
      fetch.mockResponses(mock(`${cpuBalance}.0000 CPU`))
    })

    test("returns the cpu balance", async () => {
      const cpuBalance = await orejs.getCpuBalance(oreAccountName)
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_currency_balance`)
      expect(cpuBalance).toEqual(cpuBalance)
    })
  })
})
