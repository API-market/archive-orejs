const { expectFetch, mock, mockInfo } = require("../helpers/fetch")
const { constructOrejs, mockContract } = require("../helpers/orejs")

describe("ore", () => {
  let orejs

  beforeAll(() => {
    orejs = constructOrejs()
  })

  describe("getOreBalance", () => {
    let oreBalance

    beforeEach(() => {
      oreBalance = 30

      fetch.resetMocks()
      fetch.mockResponses(mock(`${oreBalance}.0000 ORE`))
    })

    test("returns the ore balance", async () => {
      const oreBalance = await orejs.getOreBalance(ORE_TESTA_ACCOUNT_NAME)
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_currency_balance`)
      expect(oreBalance).toEqual(oreBalance)
    })
  })

  describe("approveOre", () => {
    let contract, oreBalance

    beforeEach(() => {
      contract = mockContract()
      oreBalance = 10
    })

    describe("when authorized", () => {
      test("returns", async () => {
        const result = await orejs.approveOre(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance)
        expect(contract.approve).toHaveBeenCalledWith(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, `${oreBalance}.0000 ORE`, {'authorization': `${ORE_OWNER_ACCOUNT_NAME}@active`})
      })
    })

    describe("when unauthorized", () => {
      test("throws", () => {
        contract.approve.mockImplementationOnce(() => {
          return Promise.reject(new Error("unauthorized"))
        })

        const result = orejs.approveOre(ORE_TESTA_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance)
        expect(result).rejects.toThrow(/unauthorized/)
      })
    })
  })

  describe("transferOre", () => {
    let contract, oreBalance

    beforeEach(() => {
      contract = mockContract()
      oreBalance = 10
    })

    describe("when authorized", () => {
      test("returns", async () => {
        const result = await orejs.transferOre(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance)
        expect(contract.transfer).toHaveBeenCalledWith(ORE_OWNER_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, `${oreBalance}.0000 ORE`, "", {'authorization': `${ORE_OWNER_ACCOUNT_NAME}@active`})
      })
    })

    describe("when unauthorized", () => {
      test("throws", () => {
        contract.approve.mockImplementationOnce(() => {
          return Promise.reject(new Error("unauthorized"))
        })

        const result = orejs.transferOre(ORE_TESTA_ACCOUNT_NAME, ORE_TESTA_ACCOUNT_NAME, oreBalance)
        expect(result).rejects.toThrow(/unauthorized/)
      })
    })
  })
})
