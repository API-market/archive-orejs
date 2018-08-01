
const { expectFetch, mockAccount } = require("./helpers/fetch")
const { constructOrejs, mockTransaction } = require("./helpers/orejs")

describe("account", () => {
  let orejs

  beforeAll(() => {
    orejs = constructOrejs()
  })

  describe("createOreAccount", () => {
    let spy

    beforeEach(() => {
      transaction = mockTransaction()
      spy = jest.spyOn(orejs.eos, 'transaction')
    })

    test("returns a new account", async () => {
      const account = await orejs.createOreAccount(WALLET_PASSWORD, ORE_OWNER_ACCOUNT_KEY)
      expect(spy).toHaveBeenCalledWith(expect.any(Function))
      expect(account).toEqual({
        oreAccountName: expect.stringMatching(/[a-z1-6]{12}/),
        privateKey: expect.stringMatching(/\w*/), // TODO Validate with ecc
        publicKey: expect.stringMatching(/EOS\w*/), // TODO Validate with ecc
        transaction: expect.any(Function)
      })
    })
  })

  describe("getOreAccountContents", () => {
    let account

    beforeEach(() => {
      account = mockAccount()

      fetch.resetMocks()
      fetch.mockResponses(account)
    })

    test("returns the account contents", async () => {
      const accountContents = await orejs.getOreAccountContents('y4dcmrzgiyte')
      expectFetch(`${ORE_NETWORK_URI}/v1/chain/get_account`)
      expect(JSON.stringify(accountContents)).toEqual(account[0])
    })
  })
})
