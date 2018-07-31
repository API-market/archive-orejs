const { Orejs } = require("../src")
const { mockBlock, mockInfo } = require("./helpers/fetch")

describe("token", () => {
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

  describe("getLatestBlock", () => {
    let block

    beforeEach(() => {
      block = mockBlock()

      fetch.mockResponses(
        mockInfo(),
        block
      )
    })

    test("returns the latest block", async () => {
      const blockNum = await orejs.getLatestBlock()
      expect(JSON.stringify(blockNum)).toEqual(block[0])
    })
  })

  describe("hasTransaction", () => {
    let block, transactionId, transaction

    beforeAll(() => {
      transactionId = "asdf"
      transaction = {trx: {id: transactionId}}
    })

    describe("when the block includes the transaction", () => {

      beforeAll(() => {
        block = {transactions: [transaction]}
      })

      test("returns true", () => {
        const hasTransaction = orejs.hasTransaction(block, transactionId)
        expect(hasTransaction).toEqual(true)
      })
    })

    describe("when the block does not include the transaction", () => {

      beforeAll(() => {
        block = {transactions: []}
      })

      test("returns false", () => {
        const hasTransaction = orejs.hasTransaction(block, transactionId)
        expect(hasTransaction).toEqual(false)
      })
    })
  })

  describe("signVoucher", () => {
    test("signs a voucher", async () => {
      const voucherId = 0
      const sig = await orejs.signVoucher(voucherId)
      console.log("SIG:", sig.toString())
      expect(sig.toString()).toEqual("SIG_K1_K7SnTcWTVuatvRepJ6vmmiHPEh3WWEYiVPB1nD9MZ3LWz91yUxR5fUWmSmNAAP9Dxs2MeKZuDUFoEVfBiKfRozaG2FzfvH")
    })
  })

  describe("tableKey", () => {
    let encodedAccountName

    beforeAll(() => {
      encodedAccountName = orejs.tableKey(oreAccountName)
    })

    test("returns a number", () => {
      expect(encodedAccountName.toString()).toEqual("14605613949550624768")
    })

    test("returns a BigNumber", () => {
      expect(encodedAccountName.plus(1).toString()).toEqual("14605613949550624769")
    })
  })
})
